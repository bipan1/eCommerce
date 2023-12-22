'use client'
import { useAppSelector } from '../../redux/store';
import { MdOutlineCancel } from "react-icons/md";
import { useAppDispatch } from '../../redux/store';
import { closeBag } from '../../redux/features/bag-slice';
import { Button } from 'antd';

export default function Cart() {

    const dispatch = useAppDispatch()


    const bag = useAppSelector((state) => state.bag);
    const { isBagOpen, items } = bag;

    return (
        <>

            {isBagOpen ?
                <div className='fixed top-20 right-0 h-full w-1/4 bg-white shadow-lg z-[100000000] transition duration-300 ease-in-out transform p-5'>
                    <div className='flex'>
                        <p className='text-3xl'>Your cart</p>
                        <MdOutlineCancel onClick={() => dispatch(closeBag())} className='ml-auto' size={20} />
                    </div>
                    {items.length > 0 ? <div>

                    </div> : <div className='text-gray-500 flex flex-col items-center justify-center'>
                        <img src="/emptycart.png" className='mt-10 w-60 h-50 mb-4' alt="Empty cart" />
                        <p className='text-center mb-4'>Your cart is currently empty.</p>
                        <p className='text-center mb-6'>Before heading to checkout, you must add some items to your cart.</p>
                    </div>}
                    <div className='mt-auto'>
                        <Button disabled={items.length === 0} className="mt-10 w-full h-12 bg-blue-400 border border-blue mb-3" size='large' type="primary">Chechout</Button>
                    </div>

                </div>
                : null}
        </>
    )
}