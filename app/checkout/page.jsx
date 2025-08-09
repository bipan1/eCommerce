'use client'
import Payment from "@/components/payment"
import { useSelector } from 'react-redux';
import AddressForm from "components/address/addressForm";
import { Input } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSession } from 'next-auth/react';
import { convertToFloat } from "utils";
import { axiosApiCall } from "utils/axiosApiCall";
import Spinner from "@/components/spinner";


export default function CheckoutPage() {
    // const [shippingMethod, setShippingMethod] = useState('delivery');
    const [places, setPlaces] = useState({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession()

    // const handleShippingChange = (e) => {
    //     setShippingMethod(e.target.value)
    // }

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const response = await axiosApiCall(`/user/${session.user.id}`)
            const user = response.data.user;

            if (user.phoneNumber) {
                setPhoneNumber(user.phoneNumber)

            }
            if (user.addressId) {
                const response = await axiosApiCall(`/address/${user.addressId}`);
                const address = response.data.address;
                setPlaces({
                    addressLine: address.addressLine,
                    suburb: address.suburb,
                    state: address.state,
                    postcode: address.postcode
                })
            }
            setLoading(false)
        }

        if (session) {
            setFullName(session.user.name);
            setEmail(session.user.email)
            fetchUserData();
        }
    }, []);


    const bag = useSelector((state) => state.bag);
    const { items } = bag;

    const subTotal = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity * item.price, 0);
    }, [bag]);

    return <div className="flex flex-col lg:flex-row w-full lg:gap-4 pb-6">
        {loading && <Spinner />}
        <div className="flex-1 flex justify-center lg:justify-end mb-4 p-3 md:p-4">
            <div className="w-full lg:w-3/5">
                <h1 className="mt-2 text-base md:text-lg font-bold">Order Summary</h1>
                <div className="flow-root">
                    <ul role="list" className="-my-1 mt-3">
                        {items.map(item => {
                            return <div key={item.id}>
                                <li className="flex py-2">
                                    <div className="h-14 w-14 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                        <img src={item.image} alt="Product Image" className="h-full w-full object-cover object-center" />
                                    </div>

                                    <div className="ml-3 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-sm md:text-base font-medium text-gray-900 leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-1 text-xs md:text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="ml-3 text-sm md:text-base font-medium text-gray-900">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        })}
                    </ul>
                    <div className="mt-6">
                        <div className="mt-4 border-t border-b py-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                                <p className="text-sm font-semibold text-gray-900">${convertToFloat(subTotal)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Shipping</p>
                                <p className="text-sm font-semibold text-gray-900">{subTotal > 100 ? 'Free' : '$8.00'}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-base font-medium text-gray-900">Total</p>
                            <p className="text-lg md:text-xl font-semibold text-gray-900">${convertToFloat(subTotal + (subTotal > 100 ? 0 : 8.00))}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div className="flex-1 justify-center lg:justify-start bg-white flex overflow-visible">
            <div className="w-full lg:w-2/3 p-4 md:p-6 mr-3 pb-8 overflow-visible">
                {session ? <div className="mb-6">
                    <p className="text-lg font-medium">Account</p>
                    <p className="text-gray-400 text-sm">{session.user.email}</p>
                </div> : <div className="mb-6">
                    <p className="text-lg font-medium">Contact</p>
                    <Input required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" placeholder="Enter email" size="large" />
                    <p className="mt-2 text-red-500">{error.email && error.email}</p>
                </div>}

                {/* <p className="text-lg mt-6 font-medium">Shipping Method</p>
                    <Radio.Group onChange={handleShippingChange} value={shippingMethod}>
                        <Radio className="text-gray-400" value="delivery"> Delivery </Radio>
                        <Radio className="text-gray-400" value="pickup"> Pick Up </Radio>
                    </Radio.Group> */}

                <p className="text-lg mt-6 font-medium">Delivery Details</p>
                <p className="text-gray-400 text-sm mb-3">Address where product is delivered.</p>
                <div className="mb-2">
                    <Input
                        type="text"
                        placeholder="Full name"
                        size="large"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <p className="mt-2 text-red-500">{error.fullName && error.fullName}</p>
                </div>
                <AddressForm error={error} places={places} setPlaces={setPlaces} />
                <Input className="my-2" size="large" type='text' placeholder='Phone number' value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {error.phoneNumber && <p className="mt-2 text-red-500">{error.phoneNumber}</p>}
                <p className="text-lg mt-6 font-medium">Payment Details</p>
                <p className="text-gray-400 text-sm mb-3">Complete your order by providing your payment details.</p>
                <Payment error={error} setError={setError} subTotal={subTotal} places={places} email={email} fullName={fullName} phoneNumber={phoneNumber} />
            </div>
        </div>
    </div>

}
