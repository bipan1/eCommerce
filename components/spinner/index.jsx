'use client'

export default function Spinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] z-50">
            <div className="relative">
                {/* Windows-style circular loader */}
                <div className="w-12 h-12 relative">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#2C7A7B]/20"></div>
                    {/* Spinning segment */}
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#2C7A7B] border-r-transparent border-b-transparent border-l-transparent animate-[spin_1s_linear_infinite]"></div>
                    {/* Inner circle */}
                    <div className="absolute inset-2 rounded-full border-4 border-[#2C7A7B]/10"></div>
                </div>
            </div>
        </div>
    );
}