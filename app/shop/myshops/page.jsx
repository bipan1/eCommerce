'use client'
import { Button, Empty } from "antd";
import axios from "axios"
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/redux/store";
import { startLoading, stopLoading } from "@/redux/features/globalLoading-slice";
import { IoLocationSharp } from "react-icons/io5";



export default function MyShops() {
    const [myShops, setMyShops] = useState([]);
    const { data: session } = useSession()

    const router = useRouter()
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getShops = async () => {
            dispatch(startLoading())
            try {
                const shopsRes = await axios.get(`http://localhost:3000/api/shop`, { params: { userId: session.user.id } })
                setMyShops(shopsRes.data.stores)
                dispatch(stopLoading())
            } catch (err) {
                dispatch(stopLoading())
                console.log(err)
            }
        }
        getShops()
    }, [])


    return (
        <div className="mx-4">
            <div className="block w-full text-right">
                <Button onClick={() => router.push('/shop')} className="border border-black mt-5" type="default"><FaPlus className='inline mr-4' />Create Shop</Button>
            </div>
            {myShops.length > 0 ? <div className="ml-10 mt-5 flex gap-10">
                {myShops.map(shop => {
                    return <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg w-1/5">
                        <img className="w-full h-40 object-cover object-center" src={shop.coverImage} alt="Store Cover" />
                        <div className="p-4">
                            <h2 className="text-2xl font-semibold mb-2">{shop.name}</h2>
                            <p className="text-gray-600 mb-4">{shop.description}</p>
                            <div className="flex">
                                <div className="flex items-center">
                                    <IoLocationSharp className="inline text-blue-500" size={25} />
                                    <span className="text-sm text-gray-500 ml-2">17 Amstrong Street,<br /><span className="block mt-[-0.5]">Laverton</span> </span>
                                </div>
                                <div className="ml-auto">
                                    <button onClick={() => router.push(`/shop/myshops/${shop.store_id}`)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm">
                                        Edit Store
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div> : <Empty />}

        </div>
    )
}