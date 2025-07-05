'use client';
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { clearBag } from '@/redux/features/bag-slice';
import PaymentForm from "./paymentForm";
import { axiosApiCall } from "utils/axiosApiCall";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

export default function Payment({ places, error, email, fullName, phoneNumber, subTotal, setError }) {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        async function makePaymentIntent() {
            const { data } = await axiosApiCall('/stripe', 'POST', { amount: subTotal });
            setClientSecret(data.client_secret)
        }
        makePaymentIntent();
    }, []);

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
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <PaymentForm error={error} setError={setError} phoneNumber={phoneNumber} places={places} email={email} fullName={fullName} clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    );
}