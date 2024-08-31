import { useRouter } from "next/navigation";
import { SlNotebook } from "react-icons/sl";
import { TbLogout } from "react-icons/tb";

export default function AccountSettings() {
    const router = useRouter();

    return (
        <div className='w-40 p-0'>
            <div className='p-4'>
                <div onClick={() => router.push('/login')} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                    <SlNotebook size={20} />
                    Login
                </div>
                <div onClick={() => router.push('signup')} className='flex p-3 rounded-md mt-2 gap-4 cursor-pointer hover:bg-gray-300'>
                    <TbLogout size={20} />
                    Signup
                </div>
            </div>
        </div>
    )
}