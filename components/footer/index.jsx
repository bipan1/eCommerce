'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../notification/NotificationProvider';
import { BsFacebook, BsInstagram, BsTruck, BsShield, BsHeadset, BsCreditCard } from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa6';
import { FaCcVisa, FaCcMastercard, FaCcStripe } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';

const Footer = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { showNotification } = useNotification();

    const handleTrackOrderClick = () => {
        if (session) {
            router.push('/myorders');
        } else {
            showNotification('Please sign in to track your orders', 'info');
        }
    };

    return (
        <footer className="bg-gradient-to-b from-[#2C7A7B] to-[#38B2AC] text-white">
            {/* Top Section - Features */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <BsTruck className="text-2xl text-white/90" />
                            <div>
                                <h3 className="font-semibold">Free Shipping</h3>
                                <p className="text-sm text-white/80">On orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <BsShield className="text-2xl text-white/90" />
                            <div>
                                <h3 className="font-semibold">Secure Payment</h3>
                                <p className="text-sm text-white/80">100% secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <BsHeadset className="text-2xl text-white/90" />
                            <div>
                                <h3 className="font-semibold">Easy Returns</h3>
                                <p className="text-sm text-white/80">Easy returns and refunds</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="mb-4">
                            <img 
                                src="/finalfinallogo.png" 
                                alt="Sathiko Kirana Pasal Logo" 
                                className="h-20 w-auto object-contain brightness-110 contrast-125"
                            />
                        </div>
                        <p className="text-white/80 mb-4">
                            Your one-stop destination for all your shopping needs. Quality products, great prices, and excellent service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <BsFacebook className="text-xl" />
                            </a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <BsInstagram className="text-xl" />
                            </a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <FaTiktok className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Policies */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal & Policies</h3>
                        <ul className="space-y-2">
                            <li>
                                <a 
                                    href="/policies/terms-of-service.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="/policies/privacy-policy.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="/policies/refund-policy.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Refund Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/shipping" className="text-white/80 hover:text-white transition-colors">
                                    Shipping Information
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleTrackOrderClick}
                                    className="text-white/80 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    Track Your Order
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-white/80 text-sm">
                            © {new Date().getFullYear()} Sathiko Kirana Pasal. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <FaCcStripe className="h-6 w-6 text-white/90" />
                                <span className="text-white/80 text-sm">Powered by Stripe</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaCcVisa className="h-8 w-8 text-white/90" />
                                <FaCcMastercard className="h-8 w-8 text-white/90" />
                                <BsCreditCard className="h-6 w-6 text-white/90" />
                                <SiGooglepay className="h-10 w-10 text-white/90" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;