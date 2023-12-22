
'use client';
import { BsTelephoneOutbound } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'
import { TbLogout } from 'react-icons/tb'
import { signOut } from 'next-auth/react'
import { getInitials } from '../../utils';
import { useRouter } from 'next/navigation';
import { CiShop } from "react-icons/ci";

export default function Profilepage({ profileinfo }) {

    const router = useRouter();

    return <div className='w-64 p-0'>

        <div onClick={() => router.push('/profile')} className='border-b p-2 border-gray-400 cursor-pointer'>
            <div className='hover:bg-gray-300 hover:rounded-md flex p-2'>
                <div className='flex justify-center items-center border rounded-3xl bg-black text-white h-10 w-10'>
                    {getInitials(profileinfo.user.name)}
                </div>

                <div className='ml-5 items-center'>
                    <p className='font-bold'>{profileinfo.user.name}</p>
                    <p className='font-light text-gray-400'>{profileinfo.user.email}</p>
                </div>
            </div>
        </div>

        <div className='p-4'>
            <div className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <BsTelephoneOutbound size={20} />
                Contact Support
            </div>
            <div onClick={() => router.push('/shop/myshops')} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <CiShop size={20} />
                My Shops
            </div>
            <div onClick={() => router.push('/settings')} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <FiSettings size={20} />
                Settings
            </div>
            <div onClick={() => signOut()} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <TbLogout size={20} />
                Logout
            </div>
        </div>

    </div>
}