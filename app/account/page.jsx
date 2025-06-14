'use client';
import { Button, Card, Form, Input } from "antd";
import { toast } from 'react-toastify'
import AddressForm from "components/address/addressForm";
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import { axiosApiCall } from "utils/axiosApiCall";
import { useRouter } from "next/navigation";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { GrEdit } from "react-icons/gr";
import { BsPerson, BsEnvelope, BsTelephone, BsGeoAlt, BsShield } from "react-icons/bs";
import Spinner from "@/components/spinner";

export default function Account() {
    const [places, setPlaces] = useState({})
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataFetchLoading, setDataFetchLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [user, setUser] = useState();
    const { data: session } = useSession();
    const router = useRouter()
    const addressSuccess = () => toast.success("Address updated successfully")

    const handleAddressSubmit = async () => {
        try {
            setAddressLoading(true);
            await axiosApiCall(`/address`, 'POST', places);
            setAddressLoading(false);
            addressSuccess();
        } catch (error) {
            setAddressLoading(false);
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.id) return;
            
            setDataFetchLoading(true);
            try {
                const response = await axiosApiCall(`/user/${session.user.id}`);
                const userRes = response.data.user;
                setUser(userRes);

                if (userRes.phoneNumber) {
                    setPhoneNumber(userRes.phoneNumber);
                }

                // Fetch address data if user has an addressId
                if (userRes.addressId) {
                    const addressResponse = await axiosApiCall(`/address/${userRes.addressId}`);
                    const address = addressResponse.data.address;
                    setPlaces({
                        addressLine: address.addressLine || '',
                        suburb: address.suburb || '',
                        state: address.state || '',
                        postcode: address.postcode?.toString() || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setDataFetchLoading(false);
            }
        };

        fetchUserData();
    }, [session]);

    const updatePhoneNumber = async () => {
        try {
            setLoading(true);
            await axiosApiCall(`/user/${session.user.id}`, 'PUT', { phoneNumber });
            setLoading(false);
            setIsEdit(false);
            toast.success("Phone number updated successfully");
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

    return (
        <>
            {dataFetchLoading && <Spinner />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title with Back Button */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C7A7B]">My Account</h1>
                        <div className="mt-2 h-1 w-20 bg-[#FC8181] rounded-full"></div>
                    </div>
                    <Button 
                        onClick={() => router.back()} 
                        className="!flex !items-center !gap-2 !text-[#2C7A7B] hover:!text-[#FC8181] !bg-transparent !border-none !shadow-none"
                    >
                        <IoIosArrowDropleftCircle className="text-xl" />
                        <span>Back</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Personal Information Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                            <div className="p-6 border-b border-[#E2E8F0]">
                                <h2 className="text-xl font-semibold text-[#2C7A7B] flex items-center gap-2">
                                    <BsPerson className="text-lg" />
                                    Personal Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-lg">
                                    <BsEnvelope className="text-[#2C7A7B] text-lg" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email Address</p>
                                        <p className="font-medium text-[#2D3748]">{session?.user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-lg">
                                    <BsPerson className="text-[#2C7A7B] text-lg" />
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium text-[#2D3748]">{session?.user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-lg">
                                    <BsTelephone className="text-[#2C7A7B] text-lg" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        {isEdit ? (
                                            <div className="mt-2 space-y-3">
                                                <Input 
                                                    value={phoneNumber} 
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="!rounded-lg" 
                                                />
                                                <div className="flex gap-3">
                                                    <Button 
                                                        onClick={() => setIsEdit(false)} 
                                                        className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200 !border-none"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        loading={loading} 
                                                        onClick={updatePhoneNumber}
                                                        className="!bg-[#2C7A7B] !text-white hover:!bg-[#FC8181] !border-none"
                                                    >
                                                        Update
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-[#2D3748]">
                                                    {phoneNumber || "Not provided"}
                                                </p>
                                                <button 
                                                    onClick={() => setIsEdit(true)}
                                                    className="p-1.5 text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300"
                                                >
                                                    <GrEdit size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                            <div className="p-6 border-b border-[#E2E8F0]">
                                <h2 className="text-xl font-semibold text-[#2C7A7B] flex items-center gap-2">
                                    <BsGeoAlt className="text-lg" />
                                    Delivery Address
                                </h2>
                            </div>
                            <div className="p-6">
                                <AddressForm 
                                    places={places} 
                                    setPlaces={setPlaces} 
                                />
                                <Button
                                    loading={addressLoading}
                                    onClick={handleAddressSubmit}
                                    className="w-full mt-4 !bg-[#2C7A7B] !text-white hover:!bg-[#FC8181] !border-none !rounded-lg !h-10"
                                >
                                    {user?.addressId ? 'Update Address' : 'Save Address'}
                                </Button>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden mt-8">
                            <div className="p-6 border-b border-[#E2E8F0]">
                                <h2 className="text-xl font-semibold text-[#2C7A7B] flex items-center gap-2">
                                    <BsShield className="text-lg" />
                                    Security
                                </h2>
                            </div>
                            <div className="p-6">
                                <Button
                                    onClick={() => router.push('/change-password')}
                                    className="w-full !bg-[#2C7A7B] !text-white hover:!bg-[#FC8181] !border-none !rounded-lg !h-10"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
