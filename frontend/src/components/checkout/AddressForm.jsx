
import React, { useState } from 'react';
import { MapPin, Phone, User, Edit2 } from 'lucide-react';

const AddressForm = ({ onAddressSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        street: initialData.street || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.fullName) tempErrors.fullName = "Full Name is required";
        if (!formData.phone) tempErrors.phone = "Phone is required";
        else if (!/^[6-9]\d{9}$/.test(formData.phone)) tempErrors.phone = "Invalid Indian Phone Number";
        if (!formData.street) tempErrors.street = "Street Address is required";
        if (!formData.city) tempErrors.city = "City is required";
        if (!formData.pincode) tempErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode)) tempErrors.pincode = "Invalid Pincode";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onAddressSubmit(formData);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error on change
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-[#E56E0C]" /> Delivery Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input 
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 bg-stone-50 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-stone-200'} focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={10}
                            className={`w-full pl-10 pr-4 py-3 bg-stone-50 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-stone-200'} focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                            placeholder="9876543210"
                        />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Street Address</label>
                <textarea 
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className={`w-full p-4 bg-stone-50 rounded-lg border ${errors.street ? 'border-red-500' : 'border-stone-200'} focus:outline-none focus:border-[#1a1a1a] resize-none h-24 transition-colors`}
                    placeholder="Flat No, Building, Street Area..."
                ></textarea>
                {errors.street && <p className="text-xs text-red-500">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">City</label>
                    <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-stone-50 rounded-lg border ${errors.city ? 'border-red-500' : 'border-stone-200'} focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                        placeholder="Mumbai"
                    />
                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">State</label>
                    <input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:border-[#1a1a1a] transition-colors"
                        placeholder="Maharashtra"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Pincode</label>
                    <input 
                        type="text" 
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        className={`w-full px-4 py-3 bg-stone-50 rounded-lg border ${errors.pincode ? 'border-red-500' : 'border-stone-200'} focus:outline-none focus:border-[#1a1a1a] transition-colors`}
                        placeholder="400001"
                    />
                    {errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-display font-medium uppercase tracking-wider hover:bg-[#E56E0C] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300"
            >
                Proceed to Payment
            </button>
        </form>
    );
};

export default AddressForm;
