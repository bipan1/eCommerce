'use client'
import { useRouter } from "next/navigation";
import { BsCheckCircle, BsCart, BsArrowRight, BsEnvelope, BsReceipt } from "react-icons/bs";

export default function PaymentSuccess() {
    const router = useRouter();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full">
                {/* Success Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <BsCheckCircle className="text-white text-4xl" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Thank you for your purchase! Your order has been confirmed and is being processed.
                    </p>

                    {/* Information Cards */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-gradient-to-r from-[#E6FFFA] to-[#B2F5EA] rounded-2xl p-6 border border-[#2C7A7B]/20">
                            <BsEnvelope className="text-[#2C7A7B] text-2xl mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Email Confirmation</h3>
                            <p className="text-sm text-gray-600">Check your email for receipt and order details</p>
                        </div>
                        <div className="bg-gradient-to-r from-[#FFF5F5] to-[#FED7D7] rounded-2xl p-6 border border-[#FC8181]/20">
                            <BsReceipt className="text-[#FC8181] text-2xl mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Order Tracking</h3>
                            <p className="text-sm text-gray-600">You'll receive tracking information soon</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/myorders')}
                            className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-[#2C7A7B] text-[#2C7A7B] font-semibold rounded-lg hover:bg-[#2C7A7B] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <BsReceipt className="mr-2" />
                            View Orders
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] hover:from-[#FC8181] hover:to-[#F687B3] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <BsCart className="mr-2" />
                            Continue Shopping
                            <BsArrowRight className="ml-2" />
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@himalibasket.com" className="text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300 font-medium">
                                support@himalibasket.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] rounded-full opacity-10 blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-[#FC8181] to-[#F687B3] rounded-full opacity-10 blur-xl"></div>
            </div>
        </div>
    );
}