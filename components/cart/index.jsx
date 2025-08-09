'use client'
import { useNotification } from '../notification/NotificationProvider';
import { closeBag } from '@/redux/features/bag-slice';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { convertToFloat } from 'utils';
import { FaShoppingBag } from 'react-icons/fa';
import { MdArrowBack, MdClose } from 'react-icons/md';

export default function Cart() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { items: cartItems, isBagOpen } = useSelector((state) => state.bag);
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const { showNotification } = useNotification();

    const handleClose = () => {
        dispatch(closeBag());
    };

    const handleCheckout = () => {
        if (subtotal < 50) {
            showNotification('Minimum order is $50', 'error');
            return;
        }
        dispatch(closeBag());
        router.push('/checkout');
    };

    const EmptyCart = () => (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <FaShoppingBag className="w-12 h-12 text-[#2C7A7B] mb-3" />
            <h2 className="text-lg font-medium text-[#2D3748] mb-1">Your bag is empty</h2>
            <p className="text-sm text-[#4A5568] mb-6 text-center">Looks like you haven't added any items to your bag yet.</p>
            <button
                onClick={handleClose}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[#2C7A7B] hover:bg-[#285E61] transition-colors duration-300"
            >
                Start Shopping
            </button>
        </div>
    );

    const CartContent = () => (
        <div className="flex h-full flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#E2E8F0]">
                <h2 className="text-lg font-medium text-[#2D3748]">Shopping Bag</h2>
                <button
                    onClick={handleClose}
                    className="p-1.5 text-[#A0AEC0] hover:text-[#2C7A7B] hover:bg-[#F7FAFC] rounded-md transition-colors duration-300"
                >
                    <MdClose className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {cartItems.length > 0 ? (
                    <div className="px-4">
                        <div className="flow-root">
                            <ul role="list" className="divide-y divide-[#E2E8F0]">
                                {cartItems.map((item) => (
                                    <CartItem key={item.productId} item={item} />
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <EmptyCart />
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="border-t border-[#E2E8F0] px-4 py-4">
                    <div className="flex justify-between text-sm font-medium text-[#2D3748] mb-3">
                        <p>Subtotal</p>
                        <p className="text-[#FC8181]">${subtotal.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-[#4A5568] mb-4">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleCheckout}
                            className="w-full flex justify-center items-center px-4 py-2.5 text-sm font-medium rounded-md text-white bg-[#2C7A7B] hover:bg-[#285E61] transition-colors duration-300 shadow-sm"
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={handleClose}
                            className="w-full flex justify-center items-center px-4 py-2.5 text-sm font-medium rounded-md text-[#2C7A7B] bg-[#F7FAFC] hover:bg-[#E6FFFA] transition-colors duration-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    

    return (
        <>
            {isBagOpen && (
                <div className="relative z-[101]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={handleClose}></div>
                    <div className="fixed inset-0 overflow-hidden" onClick={handleClose}>
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-2 md:pl-10">
                                <div className="pointer-events-auto w-screen max-w-md" onClick={(e) => e.stopPropagation()}>
                                    <CartContent />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}