
'use client';
import { TbLogout } from 'react-icons/tb'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { RiAccountCircleLine } from "react-icons/ri";
import { SlNotebook } from "react-icons/sl";


export default function Profilepage({ profileinfo }) {
    const router = useRouter()

    return <div className='lg:w-70 md:w-60 sm:w-50 p-0'>

        <div onClick={() => router.push('/account')} className='border-b p-2 border-gray-400 cursor-pointer'>
            <div className='hover:bg-gray-300 hover:rounded-md flex p-2'>

                <div className='ml-5 items-center'>
                    <p className='font-bold'>{profileinfo.user.name}</p>
                    <p className='font-light text-gray-400'>{profileinfo.user.email}</p>
                </div>
            </div>
        </div>

        <div className='p-4'>
            <div onClick={() => router.push('/myorders')} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <SlNotebook size={20} />
                My Orders
            </div>
            {profileinfo.user.isAdmin && <div onClick={() => router.push('/admin/category')} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <RiAccountCircleLine size={20} />
                Admin
            </div>}
            <div onClick={() => signOut()} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                <TbLogout size={20} />
                Logout
            </div>
        </div>

    </div>
}