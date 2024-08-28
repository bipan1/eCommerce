'use client';
import { Button, Card, Form, Input } from "antd";
import AddressForm from "components/address/addressForm";
import { useSession } from 'next-auth/react'
import { useEffect, useState } from "react";
import { axiosApiCall } from "utils/axiosApiCall";

export default function Account() {
    const [places, setPlaces] = useState({})
    const { data: session } = useSession();

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
        <div className="flex flex-col lg:flex-row mt-10 w-full lg:gap-4 p-2">
            <div className="flex-1 w-full lg:w-2/3 mt-4 lg:mt-0">
                <div className="mb-6">
                    <Card title="Personal Information">
                        <p><span className="font-bold">Name:</span> {session?.user.name}</p>
                        <p><span className="font-bold">Email:</span> {session?.user.email}</p>
                    </Card>
                </div>

                <div className="">
                    <Card title="Edit your address">
                        <AddressForm places={places} setPlaces={setPlaces} />
                        <Button onClick={handleAddressSubmit} className="!bg-green-400 float-right !text-white">
                            Update
                        </Button>
                    </Card>
                </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end">
                <div className="w-full lg:w-3/5">
                    <Card title="Change Password">
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
    )
}
