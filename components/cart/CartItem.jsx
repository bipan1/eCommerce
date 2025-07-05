import { useDispatch } from "react-redux";
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import { removeCartItem, updateCartItemQuantity, removeItem, increaseQuantity, decreaseQuantity } from '@/redux/features/bag-slice';
import { FaPlus, FaMinus } from "react-icons/fa";
import { useState } from "react";

export default function CartItem({ item }) {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async () => {
        if (session) {
            // Logged-in user: use backend synchronization
            if (isUpdating) return;
            
            setIsUpdating(true);
            try {
                await dispatch(removeCartItem(item.productId)).unwrap();
                toast.success('Item removed from cart');
            } catch (error) {
                console.error('Error removing item:', error);
                toast.error(error || 'Failed to remove item');
            } finally {
                setIsUpdating(false);
            }
        } else {
            // Guest user: use local cart only
            dispatch(removeItem(item.productId));
            toast.success('Item removed from cart');
        }
    }

    const handleIncreaseQuantity = async () => {
        if (session) {
            // Logged-in user: use backend synchronization
            if (isUpdating) return;
            
            setIsUpdating(true);
            try {
                await dispatch(updateCartItemQuantity({
                    productId: item.productId,
                    quantity: item.quantity + 1
                })).unwrap();
            } catch (error) {
                console.error('Error updating quantity:', error);
                toast.error(error || 'Failed to update quantity');
            } finally {
                setIsUpdating(false);
            }
        } else {
            // Guest user: use local cart only
            dispatch(increaseQuantity(item.productId));
        }
    }

    const handleDecreaseQuantity = async () => {
        if (session) {
            // Logged-in user: use backend synchronization
            if (isUpdating) return;
            
            setIsUpdating(true);
            try {
                if (item.quantity <= 1) {
                    await dispatch(removeCartItem(item.productId)).unwrap();
                    toast.success('Item removed from cart');
                } else {
                    await dispatch(updateCartItemQuantity({
                        productId: item.productId,
                        quantity: item.quantity - 1
                    })).unwrap();
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
                toast.error(error || 'Failed to update quantity');
            } finally {
                setIsUpdating(false);
            }
        } else {
            // Guest user: use local cart only
            dispatch(decreaseQuantity(item.productId));
        }
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
                        disabled={session && isUpdating}
                        className="p-1.5 text-[#A0AEC0] hover:text-[#FC8181] hover:bg-[#FFF5F5] rounded-md transition-colors duration-300 disabled:opacity-50"
                    >
                        <MdDelete className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#E2E8F0] rounded-md overflow-hidden bg-white">
                            <button 
                                onClick={handleDecreaseQuantity}
                                disabled={session && isUpdating}
                                className="px-2 py-1 text-[#4A5568] hover:bg-[#F7FAFC] transition-colors duration-300 disabled:opacity-50"
                            >
                                <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-[#2D3748] font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <button 
                                onClick={handleIncreaseQuantity}
                                disabled={session && isUpdating}
                                className="px-2 py-1 text-[#4A5568] hover:bg-[#F7FAFC] transition-colors duration-300 disabled:opacity-50"
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