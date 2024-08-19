'use client'
import Payment from "@/components/payment"
import { useSelector } from 'react-redux';
import AddressForm from "components/address/addressForm";
import { Input, Radio } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSession } from 'next-auth/react';
import { convertToFloat } from "utils";
import axios from "axios";


export default function CheckoutPage() {
    const [shippingMethod, setShippingMethod] = useState('delivery');
    const [places, setPlaces] = useState({});
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState()

    const { data: session } = useSession()

    const handleShippingChange = (e) => {
        setShippingMethod(e.target.value)
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await axios.get(`http://localhost:3000/api/user/${session.user.id}`)
            const user = response.data.user;

            if (user.addressId) {
                const response = await axios.get(`http://localhost:3000/api/address/${user.addressId}`);
                const address = response.data.address;
                setPlaces({
                    addressLine: address.addressLine,
                    suburb: address.suburb,
                    state: address.state,
                    postcode: address.postcode
                })
            }
        }

        if (session) {
            setFullName(session.user.name);
            fetchUserData();
        }
    }, []);


    const bag = useSelector((state) => state.bag);
    const { items } = bag;

    const subTotal = useMemo(() => {
        return items.reduce((total, item) => total + item.quantity * item.price, 0);
    }, [bag]);

    return <div className="">
        <div className="flex w-full lg:flex lg:items-start lg:gap-12">
            <div style={{ minHeight: '100vh' }} className="pl-10 flex-1 bg-white flex justify-end">
                <div className="w-2/3 p-6 mr-3">
                    {session ? <div>
                        <p class="text-xl font-medium">Account</p>
                        <p class="text-gray-400 text-sm">{session.user.email}</p>
                    </div> : <div>
                        <p class="text-xl font-medium">Contact</p>
                        <Input required value={email} onChange={(e) => setEmail(e.target.value)} className="" placeholder="Enter email" size="large" />
                    </div>}
                    <p class="text-xl mt-8 font-medium">Shipping Method</p>
                    <Radio.Group onChange={handleShippingChange} value={shippingMethod}>
                        <Radio className="text-gray-400" value="delivery"> Delivery </Radio>
                        <Radio className="text-gray-400" value="pickup"> Pick Up </Radio>
                    </Radio.Group>
                    <p class="text-xl mt-8 font-medium">Delivery Details</p>
                    <p class="text-gray-400 text-sm mb-3">Address where product is delivered.</p>
                    <div className="mb-2">
                        <Input
                            type="text"
                            placeholder="Full name"
                            size="large"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <AddressForm places={places} setPlaces={setPlaces} />
                    <Input className="my-2" size="large" type='text' placeholder='Phone number' value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <p class="text-xl mt-8 font-medium">Payment Details</p>
                    <p class="text-gray-400 text-sm mb-3">Complete your order by providing your payment details.</p>
                    <Payment places={places} email={email} fullName={fullName} shippingMethod={shippingMethod} phoneNumber={phoneNumber} />
                </div>
            </div>

            <div className="flex-1 mb-10">
                <h1 className="mt-2 text-lg">Order Summary</h1>
                <div class="flow-root">
                    <ul role="list" class="-my-2 w-1/2 mt-5">
                        {items.map(item => {
                            return <div>
                                <li class="flex py-2">
                                    <div class="h-20 w-20 flex-shrink-0 overflow-hidden">
                                        <img src={item.image} alt="Product Image" class="h-full w-full object-cover object-center" />
                                    </div>

                                    <div class="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div class="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <a href="#">{item.name}</a>
                                                    <p class="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </h3>
                                                <p class="ml-4">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        })}
                    </ul>
                    <div className="mt-10 w-1/2">
                        <div class="mt-6 border-t border-b py-2">
                            <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-gray-900">Subtotal</p>
                                <p class="font-semibold text-gray-900">${convertToFloat(subTotal)}</p>
                            </div>
                            <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-gray-900">Shipping</p>
                                <p class="font-semibold text-gray-900">$8.00</p>
                            </div>
                        </div>
                        <div class="mt-6 flex items-center justify-between">
                            <p class="text-sm font-medium text-gray-900">Total</p>
                            <p class="text-2xl font-semibold text-gray-900">${convertToFloat(subTotal + 8.00)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

}
