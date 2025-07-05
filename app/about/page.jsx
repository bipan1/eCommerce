'use client';

import { FaHeart, FaLeaf, FaTruck, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { BsCheckCircle } from 'react-icons/bs';

export default function AboutPage() {
    const values = [
        {
            icon: <FaLeaf className="text-3xl text-white" />,
            title: "Fresh Quality",
            description: "We source only the freshest, highest quality products to ensure you get the best value for your money."
        },
        {
            icon: <FaTruck className="text-3xl text-white" />,
            title: "Fast Delivery",
            description: "Same-day delivery available for orders placed before 4 PM. Your convenience is our priority."
        },
        {
            icon: <FaUsers className="text-3xl text-white" />,
            title: "Customer First",
            description: "Our dedicated customer service team is here to help you with any questions or concerns."
        },
        {
            icon: <FaShieldAlt className="text-3xl text-white" />,
            title: "Secure Shopping",
            description: "Your personal information and payment details are protected with industry-leading security."
        }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            About <span className="text-[#FC8181]">Sathiko Pasal</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Your trusted partner for fresh groceries and quality products, delivered with care since 2020
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-[#2C7A7B] mb-6">Our Story</h2>
                                <p className="text-lg text-gray-600 mb-6">
                                    Founded in 2020, Sathiko Pasal began as a small family business with a simple mission: 
                                    to bring fresh, quality groceries directly to your doorstep. What started as a local 
                                    delivery service has grown into a trusted online marketplace serving thousands of families.
                                </p>
                                <p className="text-lg text-gray-600 mb-6">
                                    We believe that everyone deserves access to fresh, nutritious food without the hassle 
                                    of traditional grocery shopping. Our team carefully selects each product, partners with 
                                    local suppliers, and ensures that every order meets our high standards for quality and freshness.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#2C7A7B] text-xl" />
                                        <span className="text-gray-700">Locally sourced when possible</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#2C7A7B] text-xl" />
                                        <span className="text-gray-700">Quality guaranteed on every order</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#2C7A7B] text-xl" />
                                        <span className="text-gray-700">Committed to sustainability</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="bg-gradient-to-br from-[#2C7A7B] to-[#38B2AC] rounded-2xl p-8 text-white">
                                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                    <p className="text-lg text-white/90 mb-6">
                                        To revolutionize grocery shopping by providing convenient, reliable access to fresh, 
                                        quality products while supporting local communities and promoting sustainable practices.
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <FaHeart className="text-[#FC8181] text-xl" />
                                        <span className="font-medium">Made with love for our community</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#2C7A7B] mb-4">Our Values</h2>
                            <p className="text-xl text-gray-600">
                                These core values guide everything we do at Sathiko Pasal
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2C7A7B] mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>



            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of satisfied customers who trust Sathiko Pasal for their grocery needs
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a 
                                href="/products" 
                                className="bg-white text-[#2C7A7B] px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
                            >
                                <FaLeaf className="text-xl" />
                                <span>Shop Now</span>
                            </a>
                            <a 
                                href="/contact" 
                                className="bg-[#FC8181] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#F687B3] transition-colors duration-300 flex items-center space-x-2"
                            >
                                <FaUsers className="text-xl" />
                                <span>Contact Us</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 