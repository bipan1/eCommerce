import { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Button, Input } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { axiosApiCall } from "utils/axiosApiCall";
import { useRouter } from "next/navigation";
import { clearCart, clearBag } from "@/redux/features/bag-slice";

const isEmpty = (value) => value === "";

export default function PaymentForm({ setError, error, clientSecret, places, email, fullName, phoneNumber }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cardholdername, setCardholdername] = useState();
    const bag = useSelector((state) => state.bag);
    const { items } = bag;
    const { data: session } = useSession()
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        // Only check payment intent status on mount if there's a specific need
        // Removed automatic status checking to avoid conflicts with manual payment flow
        if (!stripe || !clientSecret) {
            return;
        }

        // Only retrieve payment intent if we're returning from a redirect scenario
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
        
        if (paymentIntentClientSecret) {
            stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
                switch (paymentIntent.status) {
                    case "succeeded":
                        setMessage("Payment succeeded!");
                        break;
                    case "processing":
                        setMessage("Your payment is processing.");
                        break;
                    case "requires_payment_method":
                        setMessage("Your payment was not successful, please try again.");
                        break;
                    default:
                        setMessage("Something went wrong.");
                        break;
                }
            });
        }
    }, [stripe, clientSecret]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous error messages
        setMessage(null);

        let checkError = {};

        if (isEmpty(fullName)) {
            checkError = { fullName: "Name should be provided." }
        }
        if (isEmpty(email)) {
            checkError = { ...checkError, email: "Email is required" }
        }
        if (isEmpty(phoneNumber) && phoneNumber.length < 8) {
            checkError = { ...checkError, phoneNumber: "Enter a valid phone number" }
        }
        if (!places.addressLine) {
            checkError = { ...checkError, addressLine: "Required" }
        }
        if (!places.suburb) {
            checkError = { ...checkError, suburb: "Required" }
        }
        if (!places.state) {
            checkError = { ...checkError, state: "Required" }
        }
        if (!places.postcode) {
            checkError = { ...checkError, postcode: "Required" }
        }

        if (!cardholdername) {
            checkError = { ...checkError, cardholdername: "Card holder's name is required." }
        }

        if (Object.keys(checkError).length > 0) {
            setError(checkError);
            return;
        }

        if (!stripe || !elements) {
            return;
        }

        // Start single loading state for entire payment + order process
        setIsLoading(true);
        setMessage("Processing payment and creating order...");

        try {
            // Step 1: Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // return_url: omitted
                },
                redirect: 'if_required',
            });

            // Handle payment errors
            if (error) {
                setIsLoading(false);
                if (error.type === "card_error" || error.type === "validation_error") {
                    setMessage(error.message);
                } else {
                    setMessage("Payment failed. Please try again.");
                }
                return;
            }

            // Payment failed for other reasons
            if (paymentIntent.status !== "succeeded") {
                setIsLoading(false);
                setMessage("Payment was not successful. Please try again.");
                return;
            }

            // Step 2: Payment successful, now create order
            setMessage("Payment successful! Creating your order...");

            let addressId;
            if (session) {
                const userRes = await axiosApiCall(`/user/${session.user.id}`);
                addressId = userRes.data.user.addressId;
            }

            // Format products for API
            const formattedProducts = items.map(item => ({
                productId: item.productId || item.id,
                quantity: item.quantity,
                price: item.price
            }));

            // Create order
            const order = await axiosApiCall('/order', 'POST', {
                products: formattedProducts,
                shippingAddressId: addressId,
                addressData: places,
                paymentId: paymentIntent.id,
                paymentMethod: paymentIntent.payment_method,
                amount: paymentIntent.amount,
                guestData: {
                    name: fullName,
                    email,
                    phoneNumber
                }
            });

            // Step 3: Clear cart and redirect
            setMessage("Order created successfully! Redirecting...");
            
            try {
                if (session) {
                    await dispatch(clearCart()).unwrap();
                } else {
                    // For guest users, just clear local state
                    dispatch(clearBag());
                }
            } catch (cartError) {
                console.warn('Cart clearing failed, but order was successful:', cartError);
                // Don't fail the entire process if cart clearing fails
            }

            // Small delay to show success message before redirect
            setTimeout(() => {
                setIsLoading(false);
                router.push('/paymentsuccess');
            }, 1000);

        } catch (error) {
            console.error('Payment/Order process error:', error);
            setIsLoading(false);
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || 'Failed to create order after payment. Please contact support.';
                setMessage(errorMessage);
            } else if (error.request) {
                // Network error
                setMessage('Network error occurred. Payment may have been processed. Please contact support before retrying.');
            } else {
                // Other error
                setMessage('An unexpected error occurred. Please contact support if payment was charged.');
            }
        }
    }

    const paymentElementOptions = {
        layout: "tabs",
        defaultValues: {
            billingDetails: {
                name: cardholdername
            }
        }
    };

    return (
        <>
            <style jsx global>{`
                #payment-form {
                    overflow: visible !important;
                }
                #payment-element {
                    overflow: visible !important;
                    min-height: 250px !important;
                }
                .StripeElement {
                    overflow: visible !important;
                }
                .StripeElement iframe {
                    min-height: 200px !important;
                }
            `}</style>
            <div className="bg-white pb-6 overflow-visible">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                <Input value={cardholdername} onChange={(e) => setCardholdername(e.target.value)} size="large" type="text" placeholder="Card holder name" className="mb-3" />
                {error.cardholdername && <p className="mt-2 text-red-500">{error.cardholdername}</p>}
                <form id="payment-form" onSubmit={handleSubmit} style={{ overflow: 'visible' }}>
                    <div className="mt-4 mb-4" style={{ minHeight: '250px', overflow: 'visible' }}>
                        <PaymentElement id="payment-element" options={paymentElementOptions} />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading || !stripe || !elements}
                        className={`
                            w-full h-12 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg 
                            transform hover:scale-[1.02] active:scale-[0.98] mt-6 mb-4
                            ${isLoading || !stripe || !elements 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] hover:from-[#FC8181] hover:to-[#F687B3]'
                            }
                            disabled:transform-none disabled:hover:scale-100
                        `}
                        id="submit"
                    >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                        </div>
                    ) : (
                        'Complete Order'
                    )}
                </button>
                {message && <div className="text-red-700 mt-2" id="payment-message">{message}</div>}
            </form>
        </div>
        </>
    );
}