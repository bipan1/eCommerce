import { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Button, Input } from "antd";

export default function CheckoutForm({ clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        if (!clientSecret) {
            return;
        }

        stripe?.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-1/3">
            <form id="payment-form" onSubmit={handleSubmit}>
                <label className="mb-2">Full Name</label>
                <Input type="text" placeholder="Enter Full Name" className="mb-2" />
                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <Button htmlType="submit" className="text-white bg-blue-600 mt-2 w-full" disabled={isLoading || !stripe || !elements} id="submit">
                    Pay Now
                </Button>
                {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
    );
}