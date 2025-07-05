'use client'

export default function Spinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-[2px] z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    );
}