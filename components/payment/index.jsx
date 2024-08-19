'use client';
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PaymentForm from "./paymentForm";
import { axiosApiCall } from "utils/axiosApiCall";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

export default function Payment({ places, email, fullName, phoneNumber }) {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        async function makePaymentIntent() {
            const { data } = await axiosApiCall('/stripe', 'POST', { amount: 100 });
            setClientSecret(data.client_secret)
        }
        makePaymentIntent();
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <PaymentForm phoneNumber={phoneNumber} places={places} email={email} fullName={fullName} clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    );
}