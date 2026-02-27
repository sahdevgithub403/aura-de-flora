import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddressForm from "../components/checkout/AddressForm";
import PaymentMethods from "../components/checkout/PaymentMethods";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Loader2,
  Edit2,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  createPaymentOrderAPI,
  verifyPaymentAPI,
  placeOrderAPI,
} from "../services/api";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isSessionValid, validateSession } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("ADDRESS");
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (cart.length === 0 && step !== "SUCCESS") {
      navigate("/menu");
    }
  }, [cart, step, navigate]);

  // Redirect to login if not authenticated (check both user and token validity)
  useEffect(() => {
    if (!isSessionValid()) {
      toast.error("Please login to proceed with checkout");
      navigate("/login", {
        state: {
          returnUrl: "/checkout",
          message: "Please login to proceed with checkout",
        },
      });
    }
  }, [isSessionValid, navigate]);

  // Load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddressSubmit = (data) => {
    setAddress(data);
    setStep("PAYMENT");
    window.scrollTo(0, 0);
  };

  const handlePayment = async () => {
    // Validate session before any payment operation
    if (!validateSession()) {
      return; // validateSession handles redirect
    }

    setLoading(true);
    try {
      // Prepare Order Data payload structure

      // Combine address parts into a single string
      const fullAddressString = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;

      // Prepare Order Data payload structure
      const orderPayload = {
        // user: { id: user?.id || 1 }, // Backend uses currently authenticated user from token
        totalAmount: cartTotal,
        status: "PENDING",
        deliveryAddress: fullAddressString,
        phoneNumber: address.phone,
        orderItems: cart.map((item) => ({
          menuItem: { id: item.id },
          quantity: item.qty,
          price: item.price,
        })),
      };

      if (paymentMethod === "COD") {
        // Place COD Order directly
        const orderRes = await placeOrderAPI(orderPayload);
        setOrderSuccess({
          id: orderRes.data.id || "COD-" + Date.now(),
          amount: cartTotal,
        });
        clearCart();
        setStep("SUCCESS");
        window.scrollTo(0, 0);
      } else {
        // RAZORPAY FLOW
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          setLoading(false);
          return;
        }

        // 1. Create Order on Server
        const response = await createPaymentOrderAPI(cartTotal);
        const { orderId, amount, currency, key } = response.data;

        // 2. Options for Razorpay
        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: "Cream Island",
          description: "Ice Cream Order",
          order_id: orderId,
          handler: async function (razorpayResponse) {
            // 3. Verify Payment on Backend
            try {
              // Re-validate session before verification (token might expire during payment)
              if (!validateSession()) {
                return; // User will be redirected to login
              }

              const verifyRes = await verifyPaymentAPI({
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
              });

              if (verifyRes.data.verified) {
                // 4. Place Order in DB after successful payment
                const paidOrder = {
                  ...orderPayload,
                  paymentId: razorpayResponse.razorpay_payment_id,
                };
                const orderRes = await placeOrderAPI(paidOrder);

                setOrderSuccess({
                  id: orderRes.data.id || orderId,
                  amount: cartTotal,
                });
                clearCart();
                setStep("SUCCESS");
                window.scrollTo(0, 0);
              } else {
                toast.error("Payment verification failed!");
              }
            } catch (err) {
              console.error(err);
              // Handle auth errors gracefully (already handled by interceptor)
              if (
                err.message === "TOKEN_EXPIRED" ||
                err.message === "NO_TOKEN"
              ) {
                return;
              }
              toast.error(
                "Payment verification error. Please contact support.",
              );
            }
          },
          prefill: {
            name: address.fullName,
            email: user?.email || "",
            contact: address.phone,
          },
          theme: {
            color: "#E56E0C",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (err) {
      console.error(err);
      // Handle auth errors gracefully (already handled by interceptor)
      if (err.message === "TOKEN_EXPIRED" || err.message === "NO_TOKEN") {
        return;
      }
      toast.error("Order placement failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "SUCCESS") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center animate-scale-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-pulse">
          <CheckCircle size={48} />
        </div>
        <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-2">
          Order Confirmed!
        </h1>
        <p className="font-body text-stone-500 mb-8 max-w-md">
          Thank you for your order. We've received your request and your
          delicious ice cream will be on its way soon.
        </p>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 w-full max-w-sm mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Order ID:
            </span>
            <span className="font-mono font-bold text-[#1a1a1a]">
              {orderSuccess?.id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Amount Paid:
            </span>
            <span className="font-display font-bold text-[#E56E0C]">
              ₹{orderSuccess?.amount}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#1a1a1a] text-white px-8 py-4 rounded-xl font-display font-medium uppercase tracking-wider hover:bg-[#E56E0C] transition-colors shadow-lg"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-white text-[#1a1a1a] border border-stone-200 px-8 py-4 rounded-xl font-display font-medium uppercase tracking-wider hover:bg-stone-50 transition-colors shadow-sm"
          >
            Track Order Live
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FORMS */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() =>
                  step === "PAYMENT" ? setStep("ADDRESS") : navigate("/cart")
                }
                className="p-2 bg-white rounded-full shadow-sm hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="font-display text-3xl font-bold text-[#1a1a1a]">
                Checkout
              </h1>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 ${step === "ADDRESS" ? "text-[#E56E0C] font-bold" : "text-[#1a1a1a]"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === "ADDRESS" || step === "PAYMENT" ? "bg-[#E56E0C] text-white" : "bg-stone-200"}`}
                >
                  1
                </div>
                <span className="uppercase text-xs tracking-wider">
                  Address
                </span>
              </div>
              <div className="w-12 h-[1px] bg-stone-200"></div>
              <div
                className={`flex items-center gap-2 ${step === "PAYMENT" ? "text-[#E56E0C] font-bold" : "text-stone-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === "PAYMENT" ? "bg-[#E56E0C] text-white" : "bg-stone-200"}`}
                >
                  2
                </div>
                <span className="uppercase text-xs tracking-wider">
                  Payment
                </span>
              </div>
            </div>

            {step === "ADDRESS" ? (
              <AddressForm
                onAddressSubmit={handleAddressSubmit}
                initialData={address || {}}
              />
            ) : (
              <div className="space-y-6">
                {/* Selected Address Summary */}
                <div className="bg-white p-6 rounded-xl border border-stone-100 flex justify-between items-start">
                  <div>
                    <h4 className="font-display font-bold text-[#1a1a1a] mb-1">
                      Delivering to:
                    </h4>
                    <p className="font-body text-sm text-stone-600">
                      {address.fullName}, {address.phone}
                    </p>
                    <p className="font-body text-sm text-stone-500">
                      {address.street}, {address.city} - {address.pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("ADDRESS")}
                    className="text-[#E56E0C] hover:underline flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                </div>

                <PaymentMethods
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                />

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-display font-medium uppercase tracking-wider hover:bg-[#E56E0C] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span>Pay ₹{cartTotal}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-fit sticky top-32">
            <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#E56E0C]" /> Order Summary
            </h3>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollbar-hide">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <span className="text-stone-400 font-bold text-xs pt-1">
                      {item.qty}x
                    </span>
                    <div>
                      <p className="font-body text-sm font-bold text-[#1a1a1a]">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-400">₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-body text-sm font-bold text-[#1a1a1a]">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-lg font-display font-bold text-[#1a1a1a] pt-2 border-t border-dashed border-stone-200 mt-2">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
