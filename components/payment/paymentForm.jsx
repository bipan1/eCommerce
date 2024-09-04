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
import { clearBag } from "@/redux/features/bag-slice";

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

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // return_url: omitted
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
            setIsLoading(true);

            try {
                if (session) {
                    const userRes = await axiosApiCall(`/user/${session.user.id}`);
                    addressId = userRes.data.user.addressId;
                }


                const order = await axiosApiCall('/order', 'POST', {
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
                })
                setIsLoading(false);
                dispatch(clearBag());
                router.push('/paymentsuccess');
            } catch (e) {
                console.log(e);
            }

        }
    }

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <div className="bg-white">
            <label className="">Full name</label>
            <Input value={cardholdername} onChange={(e) => setCardholdername(e.target.value)} size="large" type="text" placeholder="Card holder name" className="mb-3" />
            {error.cardholdername && <p className="mt-2 text-red-500">{error.cardholdername}</p>}
            <form id="payment-form" onSubmit={handleSubmit}>
                <PaymentElement className="mt-2" id="payment-element" options={paymentElementOptions} />
                <Button loading={isLoading} size="large" htmlType="submit" className="!bg-green-900 !text-white mt-2 w-full" disabled={isLoading || !stripe || !elements} id="submit">
                    Pay Now
                </Button>
                {message && <div className="text-red-700" id="payment-message">{message}</div>}
            </form>
        </div>
    );
}