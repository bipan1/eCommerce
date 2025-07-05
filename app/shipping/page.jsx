'use client';

import { FaTruck, FaClock, FaMapMarkerAlt, FaCheckCircle, FaShippingFast, FaCalendarAlt } from 'react-icons/fa';
import { BsCheckCircle, BsInfoCircle, BsTruck } from 'react-icons/bs';
import { MdOutlineLocalShipping, MdSchedule } from 'react-icons/md';

export default function ShippingPage() {
    const deliveryAreas = [
        { suburb: "Laverton", postcode: "3028" },
        { suburb: "Altona", postcode: "3018" },
        { suburb: "Altona Meadows", postcode: "3028" },
        { suburb: "Seabrook", postcode: "3028" },
        { suburb: "Point Cook", postcode: "3030" },
        { suburb: "Williams Landing", postcode: "3027" },
        { suburb: "Hoppers Crossing", postcode: "3029" },
        { suburb: "Tarneit", postcode: "3029" },
        { suburb: "Truganina", postcode: "3029" },
        { suburb: "Werribee", postcode: "3030" },
        { suburb: "Altona North", postcode: "3025" },
        { suburb: "Brooklyn", postcode: "3012" },
        { suburb: "Spotswood", postcode: "3015" },
        { suburb: "Newport", postcode: "3015" },
        { suburb: "Yarraville", postcode: "3013" },
        { suburb: "Footscray", postcode: "3011" },
        { suburb: "Sunshine", postcode: "3020" },
        { suburb: "Sunshine North", postcode: "3020" },
        { suburb: "Sunshine West", postcode: "3020" },
        { suburb: "St Albans", postcode: "3021" }
    ];

    const shippingFeatures = [
        {
            icon: <FaClock className="text-3xl text-white" />,
            title: "Daily Delivery",
            description: "Orders delivered every day after 5 PM for your convenience"
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl text-white" />,
            title: "Wide Coverage",
            description: "Delivering to 20+ suburbs across Melbourne's western region"
        },
        {
            icon: <FaShippingFast className="text-3xl text-white" />,
            title: "Fresh Guarantee",
            description: "All products delivered fresh with temperature-controlled transport"
        },
        {
            icon: <FaCheckCircle className="text-3xl text-white" />,
            title: "Reliable Service",
            description: "Consistent delivery times and professional service you can trust"
        }
    ];

    const deliveryInfo = [
        {
            icon: <MdSchedule className="text-2xl text-[#2C7A7B]" />,
            title: "Delivery Time",
            details: "Every day after 5:00 PM"
        },
        {
            icon: <FaCalendarAlt className="text-2xl text-[#2C7A7B]" />,
            title: "Order Cut-off",
            details: "Place orders by 3:00 PM for same-day delivery"
        },
        {
            icon: <FaTruck className="text-2xl text-[#2C7A7B]" />,
            title: "Delivery Fee",
            details: "Free delivery on orders over $50"
        },
        {
            icon: <BsInfoCircle className="text-2xl text-[#2C7A7B]" />,
            title: "Special Instructions",
            details: "Add delivery notes during checkout"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                                <FaTruck className="text-5xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Shipping <span className="text-[#FC8181]">Information</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Fast, reliable delivery to your doorstep across Melbourne's western suburbs
                        </p>
                    </div>
                </div>
            </div>

            {/* Delivery Features */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#2C7A7B] mb-4">Why Choose Our Delivery Service?</h2>
                            <p className="text-xl text-gray-600">
                                We're committed to providing the best delivery experience
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {shippingFeatures.map((feature, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2C7A7B] mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Information */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#2C7A7B] mb-4">Delivery Details</h2>
                            <p className="text-xl text-gray-600">
                                Everything you need to know about our delivery service
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {deliveryInfo.map((info, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow duration-300">
                                    <div className="bg-[#E6FFFA] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                        {info.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2C7A7B] mb-3">{info.title}</h3>
                                    <p className="text-gray-600 font-medium">{info.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Coverage Areas */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#2C7A7B] mb-4">Delivery Coverage Areas</h2>
                            <p className="text-xl text-gray-600 mb-8">
                                We currently deliver to the following suburbs across Melbourne's western region
                            </p>
                            <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white rounded-2xl p-8 inline-block">
                                <div className="flex items-center space-x-3">
                                    <MdOutlineLocalShipping className="text-3xl" />
                                    <div className="text-left">
                                        <div className="text-2xl font-bold">Daily Delivery</div>
                                        <div className="text-lg text-white/90">Every day after 5:00 PM</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Suburbs Grid */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-[#2C7A7B] mb-8 text-center">Serviced Suburbs</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {deliveryAreas.map((area, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E6FFFA] to-[#F0FDFA] rounded-lg hover:from-[#2C7A7B] hover:to-[#38B2AC] hover:text-white transition-all duration-300 group">
                                        <div className="flex items-center space-x-3">
                                            <BsCheckCircle className="text-[#2C7A7B] group-hover:text-white flex-shrink-0" />
                                            <span className="font-medium text-gray-800 group-hover:text-white">
                                                {area.suburb}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-white/90 font-mono">
                                            {area.postcode}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Notes */}
            <div className="py-20 bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-6">Important Delivery Information</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                                <div className="flex items-start space-x-4">
                                    <BsInfoCircle className="text-2xl text-[#FC8181] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Order Cut-off Time</h3>
                                        <p className="text-white/90">
                                            To ensure same-day delivery, please place your order by 3:00 PM. 
                                            Orders placed after this time will be delivered the following day.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                                <div className="flex items-start space-x-4">
                                    <FaTruck className="text-2xl text-[#FC8181] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Delivery Window</h3>
                                        <p className="text-white/90">
                                            Our delivery team operates from 5:00 PM onwards, ensuring fresh products 
                                            reach you at a convenient evening time when you're likely to be home.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                                <div className="flex items-start space-x-4">
                                    <FaMapMarkerAlt className="text-2xl text-[#FC8181] mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Coverage Expansion</h3>
                                        <p className="text-white/90">
                                            Don't see your suburb listed? We're constantly expanding our delivery network. 
                                            Contact us to check if we can deliver to your area or to be notified when we expand.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-[#2C7A7B] mb-6">Ready to Place Your Order?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Start shopping now and experience our convenient delivery service
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a 
                                href="/products" 
                                className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white px-8 py-4 rounded-lg font-medium hover:from-[#FC8181] hover:to-[#F687B3] transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
                            >
                                <BsTruck className="text-xl" />
                                <span>Start Shopping</span>
                            </a>
                            <a 
                                href="/contact" 
                                className="bg-white text-[#2C7A7B] border-2 border-[#2C7A7B] px-8 py-4 rounded-lg font-medium hover:bg-[#2C7A7B] hover:text-white transition-all duration-300 flex items-center space-x-2"
                            >
                                <FaMapMarkerAlt className="text-xl" />
                                <span>Check Coverage</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 