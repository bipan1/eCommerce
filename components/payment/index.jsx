'use client';
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { clearBag } from '@/redux/features/bag-slice';
import PaymentForm from "./paymentForm";
import { axiosApiCall } from "utils/axiosApiCall";
import { useSelector } from 'react-redux';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

export default function Payment({ places, error, email, fullName, phoneNumber, subTotal, setError }) {
    const [clientSecret, setClientSecret] = useState("");
    const [serverAmount, setServerAmount] = useState(null);
    const bag = useSelector((state) => state.bag);
    const { items } = bag;

    useEffect(() => {
        async function makePaymentIntent() {
            try {
                const { data } = await axiosApiCall('/stripe', 'POST', { 
                    cartItems: items 
                });
                setClientSecret(data.client_secret);
                setServerAmount(data.amount);
                
                // Verify server amount matches frontend calculation (free shipping > $100)
                const frontendTotal = subTotal + (subTotal > 100 ? 0 : 8.00);
                if (Math.abs(data.amount - frontendTotal) > 0.01) {
                    console.warn('Price mismatch detected:', {
                        frontend: frontendTotal,
                        server: data.amount
                    });
                }
            } catch (error) {
                console.error('Payment intent creation failed:', error);
                setError({ payment: 'Failed to initialize payment. Please try again.' });
            }
        }
        
        if (items && items.length > 0) {
            makePaymentIntent();
        }
    }, [items, subTotal]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#2C7A7B',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
        rules: {
            '.Input': {
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
            },
            '.Input:focus': {
                border: '1px solid #2C7A7B',
                boxShadow: '0 0 0 2px rgba(44, 122, 123, 0.1)',
            },
            '.Tab': {
                border: '1px solid #d1d5db',
                borderRadius: '8px',
            },
            '.Tab:hover': {
                backgroundColor: '#f9fafb',
            },
            '.Tab--selected': {
                backgroundColor: '#2C7A7B',
                color: '#ffffff',
            },
            // Enhanced styling for Google Pay button
            '.ExpressCheckoutElement': {
                padding: '12px 0',
            },
            '.ExpressCheckoutElement--collapsed': {
                padding: '8px 0',
            }
        },
    };
    
    const options = {
        clientSecret,
        appearance,
        // Focus on Google Pay only
        paymentMethodOrder: ['google_pay', 'card'],
        // Configure Google Pay express checkout
        expressCheckout: {
            buttonHeight: 48,
            buttonType: 'default',
            buttonTheme: 'dark',
            // Business information for Google Pay
            businessName: 'Sathiko Kirana Pasal'
        }
    };

    return (
        <div className="App">
            {clientSecret && serverAmount && (
                <Elements options={options} stripe={stripePromise}>
                    <PaymentForm error={error} setError={setError} phoneNumber={phoneNumber} places={places} email={email} fullName={fullName} clientSecret={clientSecret} serverAmount={serverAmount} />
                </Elements>
            )}
        </div>
    );
}