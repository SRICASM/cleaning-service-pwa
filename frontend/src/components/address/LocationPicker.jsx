import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Search, Navigation, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom pink marker
const pinkIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.125 12.5 28.125S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#EC4899"/>
      <circle cx="12.5" cy="12.5" r="4" fill="white"/>
    </svg>
  `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const DraggableMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return <Marker position={position} icon={pinkIcon} draggable eventHandlers={{
        dragend: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            setPosition([pos.lat, pos.lng]);
        },
    }} />;
};

const LocationPicker = ({ onConfirm, onBack, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition || [28.4595, 77.0266]);
    const [address, setAddress] = useState('Fetching address...');
    const [addressData, setAddressData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (navigator.geolocation && !initialPosition) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    console.log('Could not get current location');
                }
            );
        }
    }, [initialPosition]);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
                );
                const data = await response.json();
                if (data && data.display_name) {
                    setAddress(data.display_name);
                    setAddressData(data.address);
                }
            } catch (error) {
                setAddress('Could not fetch address');
            }
        };

        const debounce = setTimeout(fetchAddress, 500);
        return () => clearTimeout(debounce);
    }, [position]);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );
            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        }
    };

    const handleSelectSearchResult = (result) => {
        setPosition([parseFloat(result.lat), parseFloat(result.lon)]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleConfirm = () => {
        onConfirm({
            latitude: position[0],
            longitude: position[1],
            fullAddress: address,
            city: addressData?.city || addressData?.town || addressData?.village || 'Gurugram',
            state: addressData?.state || 'Haryana',
            postalCode: addressData?.postcode || '122001',
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 p-4 flex items-center gap-3">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="font-bold text-lg">Select Location</h2>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-stone-50 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search area or address"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-xl shadow-lg border border-stone-200 max-h-64 overflow-y-auto z-[1001]">
                        {searchResults.map((result, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectSearchResult(result)}
                                className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-stone-100 last:border-b-0"
                            >
                                <p className="font-medium text-sm text-stone-900">{result.display_name.split(',')[0]}</p>
                                <p className="text-xs text-stone-500 mt-0.5 truncate">{result.display_name}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    />
                    <DraggableMarker position={position} setPosition={setPosition} />
                </MapContainer>

                {/* Center instruction */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-[1000]">
                    Place the pin at exact service location
                </div>

                {/* Current Location Button */}
                <button
                    onClick={() => {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((pos) => {
                                setPosition([pos.coords.latitude, pos.coords.longitude]);
                            });
                        }
                    }}
                    className="absolute bottom-32 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-stone-50 z-[1000] border border-emerald-200"
                >
                    <Navigation className="w-5 h-5 text-emerald-600" />
                </button>
            </div>

            {/* Address Display & Confirm Button */}
            <div className="bg-white border-t border-stone-200 p-4 space-y-3">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 text-sm">
                            {address.split(',')[0]}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{address}</p>
                    </div>
                </div>

                <Button
                    onClick={handleConfirm}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-semibold rounded-xl"
                >
                    Confirm location
                </Button>
            </div>
        </div>
    );
};

export default LocationPicker;
