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
        {isBagOpen && <div className="relative z-[100000]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <div className="pointer-events-auto w-screen max-w-md">
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button onClick={handleCancel} type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                                                <span className="absolute -inset-0.5"></span>
                                                <span className="sr-only">Close panel</span>
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {items.length > 0 ? <div className="mt-8">
                                        <div className="flow-root">
                                            <ul role="list" className="-my-6 divide-y divide-gray-200">
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

                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>${convertToFloat(subTotal)}</p>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                    <Button size='large' onClick={handleChekout} className="!bg-green-500 w-full mt-5 !text-white">Checkout</Button>

                                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
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