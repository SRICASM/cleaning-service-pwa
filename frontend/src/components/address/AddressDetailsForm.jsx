import { useState } from 'react';
import { ChevronLeft, Home as HomeIcon, Users as FriendsIcon, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

const AddressDetailsForm = ({ onConfirm, onBack, locationData }) => {
    const [formData, setFormData] = useState({
        houseNo: '',
        apartment: '',
        landmark: '',
        label: 'Home',
        petType: 'No pets',
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.houseNo.trim() || !formData.apartment.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        onConfirm({
            ...locationData,
            ...formData,
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 p-4 flex items-center gap-3 z-10">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="font-bold text-lg">Provide complete address</h2>
                    <p className="text-xs text-stone-500">Detailed address helps our Expert reach you easily</p>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 p-6 space-y-4">
                {/* House/Flat No */}
                <div>
                    <input
                        type="text"
                        placeholder="House / Flat / Block No."
                        value={formData.houseNo}
                        onChange={(e) => handleChange('houseNo', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-emerald-500 text-base"
                    />
                </div>

                {/* Apartment/Road/Area */}
                <div>
                    <input
                        type="text"
                        placeholder="Apartment / Road / Area"
                        value={formData.apartment}
                        onChange={(e) => handleChange('apartment', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-emerald-500 focus:outline-none focus:border-emerald-600 text-base font-medium"
                    />
                </div>

                {/* Landmark */}
                <div>
                    <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={formData.landmark}
                        onChange={(e) => handleChange('landmark', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:border-emerald-500 text-base text-stone-500"
                    />
                </div>

                {/* Save as */}
                <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-3">Save as</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleChange('label', 'Home')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.label === 'Home'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                }`}
                        >
                            <HomeIcon className="w-4 h-4 inline-block mr-2" />
                            Home
                        </button>
                        <button
                            onClick={() => handleChange('label', 'Friends')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.label === 'Friends'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                }`}
                        >
                            <FriendsIcon className="w-4 h-4 inline-block mr-2" />
                            Friends
                        </button>
                        <button
                            onClick={() => handleChange('label', 'Other')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.label === 'Other'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                }`}
                        >
                            <MapPin className="w-4 h-4 inline-block mr-2" />
                            Other
                        </button>
                    </div>
                </div>

                {/* Do you have pets */}
                <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-3">Do you have pets?</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleChange('petType', 'No pets')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.petType === 'No pets'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                }`}
                        >
                            🚫 No pets
                        </button>
                        <button
                            onClick={() => handleChange('petType', 'Cat')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.petType === 'Cat'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                }`}
                        >
                            🐱 Cat
                        </button>
                        <button
                            onClick={() => handleChange('petType', 'Dog')}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.petType === 'Dog'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                }`}
                        >
                            🐶 Dog
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm Button */}
            <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4">
                <Button
                    onClick={handleSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-semibold rounded-xl"
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
};

export default AddressDetailsForm;
