
import React from 'react';
import { CreditCard, Wallet, Truck } from 'lucide-react';

const PaymentMethods = ({ selectedMethod, onSelect }) => {
  return (
    <div className="space-y-4 animate-fade-in-up delay-100">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-[#E56E0C]" /> Payment Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Razorpay Option */}
            <div 
                onClick={() => onSelect('RAZORPAY')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedMethod === 'RAZORPAY' ? 'border-[#E56E0C] bg-[#FFF8F0]' : 'border-stone-100 bg-white hover:border-stone-300'}`}
            >
                <div className={`p-3 rounded-full ${selectedMethod === 'RAZORPAY' ? 'bg-[#E56E0C] text-white' : 'bg-stone-100 text-stone-500'}`}>
                    <Wallet size={24} />
                </div>
                <div>
                    <h4 className="font-display font-bold text-[#1a1a1a]">Pay Online</h4>
                    <p className="text-xs text-stone-500">Cards, UPI, Netbanking via Razorpay</p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'RAZORPAY' ? 'border-[#E56E0C]' : 'border-stone-300'}`}>
                    {selectedMethod === 'RAZORPAY' && <div className="w-2 h-2 rounded-full bg-[#E56E0C]"></div>}
                </div>
            </div>

            {/* COD Option */}
            <div 
                onClick={() => onSelect('COD')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex items-center gap-4 group ${selectedMethod === 'COD' ? 'border-[#E56E0C] bg-[#FFF8F0]' : 'border-stone-100 bg-white hover:border-stone-300'}`}
            >
                <div className={`p-3 rounded-full ${selectedMethod === 'COD' ? 'bg-[#E56E0C] text-white' : 'bg-stone-100 text-stone-500'}`}>
                    <Truck size={24} />
                </div>
                <div>
                    <h4 className="font-display font-bold text-[#1a1a1a]">Cash on Delivery</h4>
                    <p className="text-xs text-stone-500">Pay when you receive your order</p>
                </div>
                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'COD' ? 'border-[#E56E0C]' : 'border-stone-300'}`}>
                    {selectedMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-[#E56E0C]"></div>}
                </div>
            </div>
        </div>
    </div>
  );
};

export default PaymentMethods;
