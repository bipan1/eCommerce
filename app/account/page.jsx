'use client';
import { Button, Card, Form, Input } from "antd";
import AddressForm from "components/address/addressForm";
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import { axiosApiCall } from "utils/axiosApiCall";
import { useRouter } from "next/navigation";
import { IoIosArrowDropleftCircle } from "react-icons/io";

export default function Account() {
    const [places, setPlaces] = useState({})
    const { data: session } = useSession();
    const router = useRouter()
    const handleAddressSubmit = async () => {
        try {
            await axiosApiCall(`/address`, 'POST', places);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await axiosApiCall(`/user/${session.user.id}`);
            const user = response.data.user;

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
        }
        fetchUserData();
    }, []);

    return (
        <>
            <div className="m-2 md:hidden">
                <Button onClick={() => router.back()} type="link" className="flex rounded-2xl !bg-green-900 !text-white" >
                    <IoIosArrowDropleftCircle className="inline mr-2" />
                    <span>Back</span>
                </Button >
            </div>
            <div className="flex flex-col lg:flex-row mt-10 w-full lg:gap-4 m-2">
                <div className="flex-1 flex justify-center lg:justify-end">
                    <div className="w-full lg:w-2/3">
                        <Card className="mb-6 shadow-lg" title="Personal Information">
                            <p><span className="font-bold">Name:</span> {session?.user.name}</p>
                            <p><span className="font-bold">Email:</span> {session?.user.email}</p>
                        </Card>


                        <Card title="Edit your address" className="shadow-lg mb-4">
                            <AddressForm places={places} setPlaces={setPlaces} />
                            <Button onClick={handleAddressSubmit} className="!bg-green-400 float-right !text-white">
                                Update
                            </Button>
                        </Card>
                    </div>
                </div>

                <div className="flex-1 flex justify-center lg:justify-start">
                    <div className="w-full lg:w-3/5">
                        <Card title="Change Password" className="shadow-lg">
                            <Form name="create-product" layout="vertical">

                                <Form.Item
                                    name="oldPassword"
                                    label="Old Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter a Name',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Old Password"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="newPassword"
                                    label="New Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter a Name',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="New password"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Confirm Password',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Confirm Password"
                                    />
                                </Form.Item>

                                <Button className="!bg-green-400 float-right !text-white">
                                    Update
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
