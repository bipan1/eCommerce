'use client'

import { useAppSelector } from "@/redux/store";

export default function Spinner() {
    const loading = useAppSelector((state) => state.loading.loading);

    return (
        <>{loading ? <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-300"></div>
        </div> : null}
        </>
    );
};