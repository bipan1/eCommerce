
'use client';
import { useDispatch, useSelector } from 'react-redux';
import { closeSideBar } from '@/redux/features/bag-slice';
import { useRouter } from "next/navigation";

export default function MobileSidebar() {
    const dispatch = useDispatch();
    const router = useRouter();

    const bag = useSelector((state) => state.bag);
    const { isSideBarOpen } = bag;
    const categories = useSelector((state) => state.category);
    const { data } = categories


    const handleCancel = () => {
        dispatch(closeSideBar())
    }

    const handleCategoryClick = (categoryId) => {
        router.push(`/products/categories/${categoryId}`)
        dispatch(closeSideBar())
    }

    return <>
        {isSideBarOpen && <div className="relative z-[100000]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                        <div className="pointer-events-auto w-screen max-w-md">
                            <div className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl">
                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-2xl font-bold !text-white" id="slide-over-title">Departements</h2>
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
                                    <div className='text-white pt-4'>
                                        {data?.map((category) => (
                                            <div onClick={() => handleCategoryClick(category.id)} className='border-b border-green-800 py-2' key={category.id}>
                                                <p className='text-lg'>{category.name}</p>
                                            </div>
                                        ))}
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