'use client'
import { Button, Empty } from "antd";
import axios from "axios"
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@/redux/store";
import { startLoading, stopLoading } from "@/redux/features/globalLoading-slice";


export default function MyShops() {
    const [myShops, setMyShops] = useState([]);
    const { data: session } = useSession()

    const router = useRouter()
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getShops = async () => {
            dispatch(startLoading())
            try {
                const shopsRes = await axios.get(`http://localhost:3000/api/shop/${session.user.id}`)
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
            <div className="ml-10">
                <Button onClick={() => router.push('/shop')} className="border border-black" type="default"><FaPlus className='inline mr-4' />Create Shop</Button>
            </div>
            {myShops.length > 0 ? <div className="ml-10 mt-5 flex gap-10">
                {myShops.map(shop => {
                    return <div className="max-w-md bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg">
                        <img className="w-full h-40 object-cover object-center" src={shop.coverImage} alt="Store Cover" />
                        <div className="p-4">
                            <h2 className="text-2xl font-semibold mb-2">{shop.name}</h2>
                            <p className="text-gray-600 mb-4">{shop.description}</p>
                            <div className="text-right">
                                <button onClick={() => router.push(`/shop/myshops/${shop.store_id}`)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                                    Edit Store
                                </button>
                            </div>
                        </div>
                    </div>
                })}
            </div> : <Empty />}

        </div>
    )
}