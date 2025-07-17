'use client';

import { useState } from 'react';
import { useNotification } from '../../components/notification/NotificationProvider';
import { FaEnvelope, FaPhone, FaUser, FaMapMarkerAlt, FaClock, FaComments } from 'react-icons/fa';
import { BsCheckCircle } from 'react-icons/bs';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    message: ''
                });
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] py-12">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2C7A7B] mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you! Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] p-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                                <p className="text-white/90">Fill out the form below and we'll get back to you soon!</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaUser className="inline mr-2 text-[#2C7A7B]" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-2 text-[#2C7A7B]" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2 text-[#2C7A7B]" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaComments className="inline mr-2 text-[#2C7A7B]" />
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white py-3 px-6 rounded-lg font-medium hover:from-[#FC8181] hover:to-[#F687B3] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <FaEnvelope className="mr-2" />
                                            Send Message
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            {/* Get in Touch Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-6">Get in Touch</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-[#2C7A7B] p-3 rounded-lg">
                                            <FaMapMarkerAlt className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Address</h4>
                                            <p className="text-gray-600">
                                                123 Main Street<br />
                                                Melbourne, VIC 3000<br />
                                                Australia
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-[#2C7A7B] p-3 rounded-lg">
                                            <FaPhone className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Phone</h4>
                                            <p className="text-gray-600">+61 3 9876 5432</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-[#2C7A7B] p-3 rounded-lg">
                                            <FaEnvelope className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Email</h4>
                                            <p className="text-gray-600">info@sathikopasal.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="bg-[#2C7A7B] p-3 rounded-lg">
                                            <FaClock className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Business Hours</h4>
                                            <p className="text-gray-600">
                                                Mon - Fri: 9:00 AM - 6:00 PM<br />
                                                Sat: 9:00 AM - 4:00 PM<br />
                                                Sun: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Why Choose Us Card */}
                            <div className="bg-gradient-to-br from-[#2C7A7B] to-[#38B2AC] rounded-2xl shadow-xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-6">Why Choose Sathiko Kirana Pasal?</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#FC8181] text-xl flex-shrink-0" />
                                        <span>Quality products at competitive prices</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#FC8181] text-xl flex-shrink-0" />
                                        <span>Fast and reliable delivery</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#FC8181] text-xl flex-shrink-0" />
                                        <span>Excellent customer service</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#FC8181] text-xl flex-shrink-0" />
                                        <span>Secure payment options</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsCheckCircle className="text-[#FC8181] text-xl flex-shrink-0" />
                                        <span>30-day return policy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 