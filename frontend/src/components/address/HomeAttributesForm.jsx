import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

const HomeAttributesForm = ({ onFinish, onBack, addressData }) => {
    const [formData, setFormData] = useState({
        houseSize: '',
        washrooms: '',
        residents: '',
    });

    const handleSelect = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!formData.houseSize || !formData.washrooms || !formData.residents) {
            alert('Please answer all questions');
            return;
        }

        onFinish({
            ...addressData,
            ...formData,
        });
    };

    const houseSizes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK'];
    const counts = ['1', '2', '3', '4'];

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-stone-200 p-4 flex items-center justify-between">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="text-stone-400 font-medium text-sm">Skip</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-24">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Tell Us About Your Home</h2>
                <p className="text-stone-500 mb-8">These details help us tailor our service to your needs</p>

                {/* House Size */}
                <div className="mb-8">
                    <label className="block text-base font-semibold text-stone-900 mb-3">What size is your house?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {houseSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSelect('houseSize', size)}
                                className={`px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.houseSize === size
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Washrooms */}
                <div className="mb-8">
                    <label className="block text-base font-semibold text-stone-900 mb-3">Number of washrooms</label>
                    <div className="grid grid-cols-4 gap-3">
                        {counts.map((count) => (
                            <button
                                key={count}
                                onClick={() => handleSelect('washrooms', count)}
                                className={`px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.washrooms === count
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Residents */}
                <div className="mb-8">
                    <label className="block text-base font-semibold text-stone-900 mb-3">Number of residents</label>
                    <div className="grid grid-cols-4 gap-3">
                        {counts.map((count) => (
                            <button
                                key={count}
                                onClick={() => handleSelect('residents', count)}
                                className={`px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${formData.residents === count
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-stone-200 text-stone-600 hover:border-emerald-300'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                    <p className="font-medium mb-1">💡 Why we ask this?</p>
                    <p className="text-blue-700">These details help us auto-select the best cleaning plan for you when you choose any service from home.</p>
                </div>
            </div>

            {/* Finish Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4">
                <Button
                    onClick={handleSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold rounded-xl"
                >
                    Finish
                </Button>
            </div>
        </div>
    );
};

export default HomeAttributesForm;
