import { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Button, Input } from "antd";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

export default function PaymentForm({ clientSecret, places, email, fullName, shippingMethod, phoneNumber }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const bag = useSelector((state) => state.bag);
    const { items } = bag;
    const { data: session } = useSession()

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

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // return_url: "http://localhost:3000",
            },
            redirect: 'if_required',


        });

        let addressId;
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent.status === "succeeded") {

            if (session) {
                const userRes = await axios.get(`http://localhost:3000/api/user/${session.user.id}`)
                addressId = userRes.data.user.addressId;
            }

            const order = await axios.post('http://localhost:3000/api/order', {
                products: items,
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
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log(order)
            setIsLoading(false);
        };
    }

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <div className="bg-white">
            <form id="payment-form" onSubmit={handleSubmit}>
                <label className="">Full name</label>
                <Input size="large" type="text" placeholder="Card holder name" className="mb-3" />
                <PaymentElement className="mt-2" id="payment-element" options={paymentElementOptions} />
                <Button loading={isLoading} size="large" htmlType="submit" className="!bg-green-500 !text-white mt-2 w-full" disabled={isLoading || !stripe || !elements} id="submit">
                    Pay Now
                </Button>
                {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
    );
}