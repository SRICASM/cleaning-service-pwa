import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import AddressListSheet from './AddressListSheet';
import LocationPicker from './LocationPicker';
import AddressDetailsForm from './AddressDetailsForm';
import HomeAttributesForm from './HomeAttributesForm';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AddressFlowManager = ({ open, onClose, onAddressSelected }) => {
    const { user, token } = useAuth();
    const [step, setStep] = useState('list'); // list | map | details | attributes
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [addressFormData, setAddressFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && user) {
            fetchAddresses();
        }
    }, [open, user]);

    const fetchAddresses = async () => {
        try {
            const response = await fetch(`${API}/users/me/addresses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                // API returns the list directly
                const addressList = Array.isArray(data) ? data : (data.addresses || []);
                setAddresses(addressList);

                // Set first as selected if exists
                if (addressList.length > 0) {
                    setSelectedAddress(addressList[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        if (onAddressSelected) {
            onAddressSelected(address);
        }
    };

    const handleAddNew = () => {
        setStep('map');
    };

    const handleLocationConfirm = (data) => {
        setLocationData(data);
        setStep('details');
    };

    const handleDetailsConfirm = (data) => {
        setAddressFormData(data);
        setStep('attributes');
    };

    const handleAttributesFinish = async (fullData) => {
        setLoading(true);
        try {
            // Save address to backend
            const response = await fetch(`${API}/users/me/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    label: fullData.label,
                    street_address: `${fullData.houseNo}, ${fullData.apartment}`,
                    apartment: fullData.apartment,
                    landmark: fullData.landmark,
                    city: fullData.city || 'Gurugram',
                    state: fullData.state || 'Haryana',
                    postal_code: fullData.postalCode || '122001',
                    latitude: fullData.latitude,
                    longitude: fullData.longitude,
                    house_size: fullData.houseSize,
                    washrooms_count: fullData.washrooms,
                    residents_count: fullData.residents,
                    pet_type: fullData.petType,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Address saved successfully!');
                await fetchAddresses();
                setStep('list');
                if (onAddressSelected) {
                    onAddressSelected(result.address);
                }
            } else {
                toast.error(result.message || 'Failed to save address');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('list');
        setLocationData(null);
        setAddressFormData(null);
        onClose();
    };

    if (step === 'map') {
        return (
            <LocationPicker
                onConfirm={handleLocationConfirm}
                onBack={() => setStep('list')}
            />
        );
    }

    if (step === 'details') {
        return (
            <AddressDetailsForm
                locationData={locationData}
                onConfirm={handleDetailsConfirm}
                onBack={() => setStep('map')}
            />
        );
    }

    if (step === 'attributes') {
        return (
            <HomeAttributesForm
                addressData={addressFormData}
                onFinish={handleAttributesFinish}
                onBack={() => setStep('details')}
            />
        );
    }

    return (
        <AddressListSheet
            open={open}
            onOpenChange={handleClose}
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={handleSelectAddress}
            onAddNew={handleAddNew}
        />
    );
};

export default AddressFlowManager;
