import Link from 'next/link';
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin, BsTruck, BsShield, BsClock, BsHeadset } from 'react-icons/bs';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#2C7A7B] to-[#38B2AC] text-white">
            {/* Top Section - Features */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center space-x-3">
                            <BsTruck className="text-2xl text-white/90" />
                            <div>
                                <h3 className="font-semibold">Free Shipping</h3>
                                <p className="text-sm text-white/80">On orders over $50</p>
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
                            <BsClock className="text-2xl text-white/90" />
                            <div>
                                <h3 className="font-semibold">24/7 Support</h3>
                                <p className="text-sm text-white/80">Dedicated support</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <BsHeadset className="text-2xl text-white/90" />
                            <div>
                                <h3 className="font-semibold">Easy Returns</h3>
                                <p className="text-sm text-white/80">30 days return policy</p>
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
                        <h3 className="text-xl font-bold mb-4">ShopHub</h3>
                        <p className="text-white/80 mb-4">
                            Your one-stop destination for all your shopping needs. Quality products, great prices, and excellent service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <BsFacebook className="text-xl" />
                            </a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <BsTwitter className="text-xl" />
                            </a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <BsInstagram className="text-xl" />
                            </a>
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                <BsLinkedin className="text-xl" />
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
                            <li>
                                <Link href="/faq" className="text-white/80 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-white/80 hover:text-white transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
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
                                <Link href="/returns" className="text-white/80 hover:text-white transition-colors">
                                    Returns Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order" className="text-white/80 hover:text-white transition-colors">
                                    Track Your Order
                                </Link>
                            </li>
                            <li>
                                <Link href="/size-guide" className="text-white/80 hover:text-white transition-colors">
                                    Size Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/gift-cards" className="text-white/80 hover:text-white transition-colors">
                                    Gift Cards
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-white/80 mb-4">
                            Subscribe to our newsletter for the latest updates and offers.
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-white text-[#2C7A7B] rounded-lg font-medium hover:bg-white/90 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-white/80 text-sm">
                            © {new Date().getFullYear()} ShopHub. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <img src="/stripe.svg" alt="Stripe" className="h-6" />
                                <span className="text-white/80 text-sm">Powered by</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <img src="/visa.svg" alt="Visa" className="h-5" />
                                <img src="/mastercard.svg" alt="Mastercard" className="h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;