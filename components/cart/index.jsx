'use client'
import { closeBag } from '@/redux/features/bag-slice';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { convertToFloat } from 'utils';


export default function Cart() {
    const [subTotal, setSubTotal] = useState(0);

    const dispatch = useDispatch()
    const router = useRouter()


    const bag = useSelector((state) => state.bag);
    const { isBagOpen, items } = bag;

    const handleCancel = () => {
        dispatch(closeBag())
    }

    useEffect(() => {
        const iTotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
        setSubTotal(iTotal);
    }, [bag])

    const handleChekout = () => {
        handleCancel();
        router.push('/checkout')
    }



    return <>
        {isBagOpen && <div class="relative z-[100000]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div class="pointer-events-auto w-screen max-w-md">
                            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    <div class="flex items-start justify-between">
                                        <h2 class="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                                        <div class="ml-3 flex h-7 items-center">
                                            <button onClick={handleCancel} type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                                                <span class="absolute -inset-0.5"></span>
                                                <span class="sr-only">Close panel</span>
                                                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {items.length > 0 ? <div class="mt-8">
                                        <div class="flow-root">
                                            <ul role="list" class="-my-6 divide-y divide-gray-200">
                                                {items.map(item => <CartItem item={item} />)}
                                            </ul>
                                        </div>
                                    </div> :
                                        <div className='text-gray-500 flex flex-col items-center justify-center'>
                                            <img src="/emptycart.png" className='mt-10 w-60 h-50 mb-4' alt="Empty cart" />
                                            <p className='text-center mb-4'>Your cart is currently empty.</p>
                                            <p className='text-center mb-6'>Before heading to checkout, you must add some items to your cart.</p>
                                        </div>
                                    }
                                </div>

                                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <div class="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>${convertToFloat(subTotal)}</p>
                                    </div>
                                    <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                    <Button size='large' onClick={handleChekout} className="!bg-green-500 w-full mt-5 !text-white">Checkout</Button>

                                    <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                                        <p>
                                            or
                                            <button onClick={handleCancel} type="button" className="ml-2 font-medium text-indigo-600 hover:text-indigo-500">
                                                Continue Shopping
                                                <span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >}
    </>
}