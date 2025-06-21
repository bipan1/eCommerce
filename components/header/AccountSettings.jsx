import Link from "next/link";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";

export default function AccountSettings({ onClose }) {
    const handleLinkClick = () => {
        onClose();
    };

    return (
        <div className='w-40 p-0'>
            <div className='p-2'>
                <Link 
                    href="/login"
                    onClick={handleLinkClick}
                    className='w-full flex items-center p-3 rounded-lg my-1 gap-3 cursor-pointer text-[#2D3748] hover:bg-[#E6FFFA] hover:text-[#2C7A7B] transition-colors duration-300'
                >
                    <FaUserCircle size={20} />
                    <span className="font-medium">Login</span>
                </Link>
                <Link 
                    href="/signup"
                    onClick={handleLinkClick}
                    className='w-full flex items-center p-3 rounded-lg my-1 gap-3 cursor-pointer text-[#2D3748] hover:bg-[#E6FFFA] hover:text-[#2C7A7B] transition-colors duration-300'
                >
                    <FaUserPlus size={20} />
                    <span className="font-medium">Signup</span>
                </Link>
            </div>
        </div>
    )
}