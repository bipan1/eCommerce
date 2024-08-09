'use client';
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./checkoutForm";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51PlgamJvA4hfRcuyShCcicm4A4SDjYC0C3R8SufXceA12DB3lkCnSkZ9TvWRQJifkm6Of0WUWDY9fvJPoP7UlNUH00XUj4odDn");

export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {

        async function makePaymentIntent() {
            const { data } = await axios.post('http://localhost:3000/api/stripe', {
                amount: 100
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
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
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    );
}