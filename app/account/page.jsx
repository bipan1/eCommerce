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
    const addressSuccess = () => toast.success("Address updated sucessfully")



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
            setDataFetchLoading(true);
            const response = await axiosApiCall(`/user/${session.user.id}`);
            const userRes = response.data.user;
            setUser(userRes)

            if (userRes.phoneNumber) {
                setPhoneNumber(userRes.phoneNumber)
            }

            if (userRes.addressId) {
                const response = await axiosApiCall(`/address/${userRes.addressId}`);
                const address = response.data.address;
                setPlaces({
                    addressLine: address.addressLine,
                    suburb: address.suburb,
                    state: address.state,
                    postcode: address.postcode
                })
            }
            setDataFetchLoading(false);
        }
        fetchUserData();
    }, []);

    const updatePhoneNumber = async () => {
        setLoading(true)

        try {
            const response = await axiosApiCall('/user/changenumber', 'POST', { phoneNumber })
            console.log(response);
            setLoading(false)
            setIsEdit(false)
        } catch (e) {
            console.log(e);
            setLoading(false)
        }
    }

    return (
        <>
            {dataFetchLoading && <Spinner />}
            <div className="m-2 md:hidden">
                <Button onClick={() => router.back()} type="link" className="flex rounded-2xl !bg-green-900 !text-white" >
                    <IoIosArrowDropleftCircle className="inline mr-2" />
                    <span>Back</span>
                </Button >
            </div>
            <div className="flex flex-col lg:flex-row mt-10 w-full lg:gap-4 m-2">
                <div className="flex-1 flex justify-center lg:justify-end">
                    <div className="w-full lg:w-2/3">
                        <Card className="shadow-lg !mb-4" title="Personal Information">
                            <p className="mb-1"><span className="font-bold">Name:</span> {session?.user.name}</p>
                            <p className="mb-1"><span className="font-bold">Email:</span> {session?.user.email}</p>
                            <p className="mb-1">
                                <span className="font-bold">Phone number:</span>
                                {isEdit ? <>
                                    <Input className="!mt-2" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                    <div className="mt-2">
                                        <Button className="mr-2 !bg-red-800 !text-white" onClick={() => setIsEdit(false)}>Cancel</Button>
                                        <Button loading={loading} onClick={updatePhoneNumber} className="!bg-green-800 !text-white">Update</Button>
                                    </div>
                                </> : <> {phoneNumber ? phoneNumber : <>Provide your phone number</>}  <GrEdit onClick={() => setIsEdit(true)} size={16} className="inline ml-3 cursor-pointer" />
                                </>}
                            </p>
                        </Card>

                        <Card title="Edit your address" className="shadow-lg !mb-4">
                            <AddressForm places={places} setPlaces={setPlaces} />
                            <Button onClick={handleAddressSubmit} loading={addressLoading} className="!bg-green-800 float-right !text-white">
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

                                <Button className="!bg-green-800 float-right !text-white">
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
