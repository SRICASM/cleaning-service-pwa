import { MapPin, ChevronDown } from 'lucide-react';

const AddressHeader = ({ selectedAddress, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="md:hidden w-full bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 hover:bg-stone-50 transition-colors"
        >
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-pink-600" />
            </div>
            <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 truncate">
                        {selectedAddress?.label || 'Home'}
                    </span>
                    {selectedAddress?.label && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium flex-shrink-0">
                            SELECTED
                        </span>
                    )}
                </div>
                <p className="text-xs text-stone-500 truncate">
                    {selectedAddress?.address || 'Select your location'}
                </p>
            </div>
            <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
        </button>
    );
};

export default AddressHeader;
