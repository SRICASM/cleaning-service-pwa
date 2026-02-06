import { Drawer } from 'vaul';
import { MapPin, Plus, Check } from 'lucide-react';
import { Button } from '../ui/button';

const AddressListSheet = ({ open, onOpenChange, addresses, selectedAddress, onSelectAddress, onAddNew }) => {
    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                    <div className="p-4 bg-white rounded-t-[20px] flex-1 overflow-y-auto">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-stone-300 mb-6" />

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-stone-900">Saved Address</h2>
                            <button
                                onClick={onAddNew}
                                className="flex items-center gap-2 text-emerald-600 font-semibold text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add address
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-12">
                                <MapPin className="w-16 h-16 mx-auto mb-4 text-stone-300" />
                                <p className="text-stone-500 mb-6">No saved addresses yet</p>
                                <Button onClick={onAddNew} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Your First Address
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => {
                                            onSelectAddress(addr);
                                            onOpenChange(false);
                                        }}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedAddress?.id === addr.id
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-stone-200 hover:border-emerald-300'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                                    <span className="font-semibold text-stone-900">{addr.label}</span>
                                                    {selectedAddress?.id === addr.id && (
                                                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                                            SELECTED
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-stone-600">{addr.address}</p>
                                                <p className="text-xs text-stone-500 mt-1">
                                                    {addr.city}, {addr.postal_code}
                                                </p>
                                            </div>
                                            {selectedAddress?.id === addr.id && (
                                                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

export default AddressListSheet;
