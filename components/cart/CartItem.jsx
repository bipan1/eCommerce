import { useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { removeItem, increaseQuantity, decreaseQuantity } from '@/redux/features/bag-slice';
import { FaPlus, FaMinus } from "react-icons/fa";

export default function CartItem({ item }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(removeItem(item.productId))
    }

    return (
        <li className="flex py-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-[#2D3748] hover:text-[#2C7A7B] transition-colors duration-300">
                        {item.name}
                    </h3>
                    <button 
                        onClick={handleDelete}
                        className="p-1.5 text-[#A0AEC0] hover:text-[#FC8181] hover:bg-[#FFF5F5] rounded-md transition-colors duration-300"
                    >
                        <MdDelete className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#E2E8F0] rounded-md overflow-hidden bg-white">
                            <button 
                                onClick={() => dispatch(decreaseQuantity(item.productId))}
                                className="px-2 py-1 text-[#4A5568] hover:bg-[#F7FAFC] transition-colors duration-300"
                            >
                                <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-[#2D3748] font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <button 
                                onClick={() => dispatch(increaseQuantity(item.productId))}
                                className="px-2 py-1 text-[#4A5568] hover:bg-[#F7FAFC] transition-colors duration-300"
                            >
                                <FaPlus className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-[#4A5568]">×</span>
                            <span className="text-sm font-medium text-[#FC8181]">${Number(item.price).toFixed(2)}</span>
                            <span className="text-sm text-[#4A5568]">=</span>
                            <span className="text-sm font-medium text-[#2C7A7B]">${Number(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}