'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, Fragment, useRef } from 'react'
import { Button, Input, Popover, Menu, Dropdown } from 'antd'
import React from 'react';
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react'
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import { MdOutlineLocalShipping, MdOutlineSupportAgent } from "react-icons/md";
import { BsBoxSeam, BsChevronDown, BsTruck, BsClock, BsStar, BsShield, BsCart, BsList, BsX, BsGrid, BsChevronRight, BsSearch, BsPerson, BsLightningCharge, BsTrophy, BsHeart, BsGear } from "react-icons/bs";
import Profilepage from './ProfilePage';
import { openBag, closeBag } from '@/redux/features/bag-slice';
import { useDispatch, useSelector } from 'react-redux';
import PopOverContent from './popOverContent';
import { getInitials } from 'utils';
import { fetchProducts } from "@/redux/features/products-slice";
import { fetchCategories } from "@/redux/features/category-slice";
import { fetchSearchProducts } from "@/redux/features/searchproducts-slice";
import { getSuggestions } from '@/utils/fuse';
import { openSideBar } from '@/redux/features/bag-slice';
import AccountSettings from './AccountSettings';
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import Spinner from '@/components/spinner';
import { RiAccountCircleLine } from "react-icons/ri";

const menuItems = [
  {
    key: 'deals',
    label: 'Today\'s Deals',
    icon: <MdOutlineLocalShipping className="text-lg" />,
  },
  {
    key: 'track',
    label: 'Track Order',
    icon: <BsBoxSeam className="text-lg" />,
  },
  {
    key: 'support',
    label: 'Customer Support',
    icon: <MdOutlineSupportAgent className="text-lg" />,
  }
];

const Header = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  
  // Redux state
  const { data: products, loading } = useSelector((state) => state.products);
  const bag = useSelector((state) => state.bag);
  const { numberOfItems, isBagOpen } = bag;

  // Local state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);

  // Get user initials for avatar
  const initials = useMemo(() => {
    if (!session?.user?.name) return '';
    return session.user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }, [session?.user]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle bag click
  const handleBagClick = () => {
    dispatch(openBag());
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filteredProducts = products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filteredProducts);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (product) => {
    router.push(`/products/${product.id}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link href="/profile">My Profile</Link>,
      icon: <BsPerson />,
    },
    {
      key: 'orders',
      label: <Link href="/myorders">My Orders</Link>,
      icon: <BsBoxSeam />,
    },
    {
      key: 'wishlist',
      label: <Link href="/wishlist">Wishlist</Link>,
      icon: <BsHeart />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <BsPerson />,
      onClick: () => signOut(),
    },
  ];

  const guestMenuItems = [
    {
      key: 'login',
      label: <Link href="/login">Sign In</Link>,
      icon: <BsPerson />,
    },
    {
      key: 'register',
      label: <Link href="/register">Create Account</Link>,
      icon: <BsPerson />,
    },
  ];

  const SearchBar = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-2xl mx-8'}`} ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for products, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
          className={`
            w-full px-4 py-2.5 pl-12 pr-4
            bg-white rounded-full
            border border-gray-200
            text-sm text-gray-700
            placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-[#2C7A7B] focus:ring-2 focus:ring-[#E6FFFA]
            ${isMobile ? 'text-sm' : 'text-base'}
          `}
        />
        <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FC8181] transition-colors"
          >
            <BsX className="text-lg" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
              <div className="text-sm font-medium text-[#2C7A7B]">
                ${product.price}
              </div>
            </button>
          ))}
          <div className="p-2 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setShowSuggestions(false);
                setSearchQuery('');
              }}
              className="w-full text-center text-sm text-[#2C7A7B] hover:text-[#FC8181] font-medium py-1"
            >
              View all results
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {loading && <Spinner />}
      {/* Top Bar - Announcement & Support */}
      <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] text-white">
        <div className="container mx-auto px-4">
          {/* Desktop Top Bar */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-4 py-2.5">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <MdOutlineLocalShipping className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">Free Shipping on Orders Over $50</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <BsTruck className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <BsShield className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">Secure Payment</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <MdOutlineSupportAgent className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Mobile Top Bar - Carousel */}
          <div className="md:hidden py-1.5">
            <div className="relative overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                <div className="flex items-center space-x-2 mx-4">
                  <MdOutlineLocalShipping className="text-base" />
                  <span className="text-xs">Free Shipping on Orders Over $50</span>
                </div>
                <div className="flex items-center space-x-2 mx-4">
                  <BsShield className="text-base" />
                  <span className="text-xs">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white shadow-md ${isScrolled ? 'fixed top-0 left-0 w-full z-50' : ''}`}>
        <div className="container mx-auto px-4">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-[#2C7A7B]">ShopHub</span>
              </Link>

              {/* Search Bar */}
              <SearchBar />

              {/* Navigation Icons */}
              <div className="flex items-center space-x-6">
                {session && (
                  <div className="hidden lg:block text-right mr-2">
                    <p className="text-sm text-gray-600">Welcome back,</p>
                    <p className="text-sm font-semibold text-[#2C7A7B]">{session.user.name}</p>
                  </div>
                )}
                <Popover
                  content={
                    session ? (
                      <div 
                        className="w-64 p-4"
                        onMouseLeave={(e) => {
                          // Close popover when mouse leaves
                          const popover = e.currentTarget.closest('.ant-popover');
                          if (popover) {
                            const closeButton = popover.querySelector('.ant-popover-close');
                            if (closeButton) closeButton.click();
                          }
                        }}
                      >
                        <div className="space-y-2">
                          <Link 
                            href="/account" 
                            className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                            onClick={(e) => {
                              // Close popover when clicking menu item
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                            }}
                          >
                            <BsPerson className="text-lg" />
                            <span>My Profile</span>
                          </Link>
                          <Link 
                            href="/myorders" 
                            className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                            onClick={(e) => {
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                            }}
                          >
                            <BsBoxSeam className="text-lg" />
                            <span>My Orders</span>
                          </Link>
                          <Link 
                            href="/wishlist" 
                            className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                            onClick={(e) => {
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                            }}
                          >
                            <BsHeart className="text-lg" />
                            <span>Wishlist</span>
                          </Link>
                          {session?.user?.isAdmin && (
                            <Link 
                              href="/admin/category" 
                              className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                              onClick={(e) => {
                                const popover = e.currentTarget.closest('.ant-popover');
                                if (popover) {
                                  const closeButton = popover.querySelector('.ant-popover-close');
                                  if (closeButton) closeButton.click();
                                }
                              }}
                            >
                              <BsGear className="text-lg" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                          <button 
                            onClick={(e) => {
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                              signOut();
                            }}
                            className="w-full flex items-center gap-2 text-gray-700 hover:text-[#FC8181] p-2 rounded hover:bg-gray-50"
                          >
                            <BsShield className="text-lg" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <AccountSettings />
                    )
                  }
                  trigger="click"
                  placement="bottomRight"
                  overlayClassName="profile-popover"
                >
                  <Button className="!flex !items-center !gap-2 !text-[#2C7A7B] !bg-transparent hover:!text-[#FC8181] !border-none !shadow-none !p-0">
                    {session ? (
                      <div className="w-8 h-8 rounded-full bg-[#2C7A7B] text-white flex items-center justify-center text-sm font-medium">
                        {initials}
                      </div>
                    ) : (
                      <BsPerson className="text-2xl" />
                    )}
                  </Button>
                </Popover>
                <Link href="/wishlist" className="relative group">
                  <BsHeart className="text-2xl text-[#2C7A7B] group-hover:text-[#FC8181] transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FC8181] text-white text-xs rounded-full flex items-center justify-center">0</span>
                </Link>
                <button onClick={handleBagClick} className="relative group">
                  <BsCart className="text-2xl text-[#2C7A7B] group-hover:text-[#FC8181] transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FC8181] text-white text-xs rounded-full flex items-center justify-center">{numberOfItems}</span>
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="border-t border-gray-100">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-8">
                  <Popover
                    content={<PopOverContent />}
                    trigger="hover"
                    placement="bottomLeft"
                  >
                    <Button className="!flex !items-center !gap-2 !text-[#2C7A7B] !bg-transparent hover:!text-[#FC8181] !border-none !shadow-none">
                      <BsGrid className="text-xl" />
                      <span className="font-medium">All Categories</span>
                      <BsChevronDown className="text-sm" />
                    </Button>
                  </Popover>
                  <Link href="/flash-deals" className="flex items-center space-x-2 text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300">
                    <BsLightningCharge className="text-xl" />
                    <span className="font-medium">Flash Deals</span>
                  </Link>
                  <Link href="/new-arrivals" className="flex items-center space-x-2 text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300">
                    <BsStar className="text-xl" />
                    <span className="font-medium">New Arrivals</span>
                  </Link>
                  <Link href="/best-sellers" className="flex items-center space-x-2 text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300">
                    <BsTrophy className="text-xl" />
                    <span className="font-medium">Best Sellers</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-6">
                  <Link href="/contact" className="text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300">
                    Contact Us
                  </Link>
                  <Link href="/track-order" className="text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300">
                    Track Order
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Top Row - Logo, Search, Cart */}
            <div className="flex items-center justify-between py-3">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#2C7A7B]">
                <BsList className="text-2xl" />
              </button>
              
              <Link href="/" className="text-xl font-bold text-[#2C7A7B]">ShopHub</Link>
              
              <div className="flex items-center space-x-4">
                <button onClick={handleBagClick} className="relative">
                  <BsCart className="text-2xl text-[#2C7A7B]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FC8181] text-white text-xs rounded-full flex items-center justify-center">{numberOfItems}</span>
                </button>
                <Popover
                  content={
                    session ? (
                      <div 
                        className="w-64 p-4"
                        onMouseLeave={(e) => {
                          // Close popover when mouse leaves
                          const popover = e.currentTarget.closest('.ant-popover');
                          if (popover) {
                            const closeButton = popover.querySelector('.ant-popover-close');
                            if (closeButton) closeButton.click();
                          }
                        }}
                      >
                        <div className="space-y-2">
                          <Link 
                            href="/account" 
                            className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                            onClick={(e) => {
                              // Close popover when clicking menu item
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                            }}
                          >
                            <BsPerson className="text-lg" />
                            <span>My Profile</span>
                          </Link>
                          <Link 
                            href="/myorders" 
                            className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                            onClick={(e) => {
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                            }}
                          >
                            <BsBoxSeam className="text-lg" />
                            <span>My Orders</span>
                          </Link>
                          <Link 
                            href="/wishlist" 
                            className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                            onClick={(e) => {
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                            }}
                          >
                            <BsHeart className="text-lg" />
                            <span>Wishlist</span>
                          </Link>
                          {session?.user?.isAdmin && (
                            <Link 
                              href="/admin/category" 
                              className="flex items-center gap-2 text-gray-700 hover:text-[#2C7A7B] p-2 rounded hover:bg-gray-50"
                              onClick={(e) => {
                                const popover = e.currentTarget.closest('.ant-popover');
                                if (popover) {
                                  const closeButton = popover.querySelector('.ant-popover-close');
                                  if (closeButton) closeButton.click();
                                }
                              }}
                            >
                              <BsGear className="text-lg" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                          <button 
                            onClick={(e) => {
                              const popover = e.currentTarget.closest('.ant-popover');
                              if (popover) {
                                const closeButton = popover.querySelector('.ant-popover-close');
                                if (closeButton) closeButton.click();
                              }
                              signOut();
                            }}
                            className="w-full flex items-center gap-2 text-gray-700 hover:text-[#FC8181] p-2 rounded hover:bg-gray-50"
                          >
                            <BsShield className="text-lg" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <AccountSettings />
                    )
                  }
                  trigger="click"
                  placement="bottomRight"
                  overlayClassName="profile-popover"
                >
                  <Button className="!flex !items-center !gap-2 !text-[#2C7A7B] !bg-transparent hover:!text-[#FC8181] !border-none !shadow-none !p-0">
                    {session ? (
                      <div className="w-8 h-8 rounded-full bg-[#2C7A7B] text-white flex items-center justify-center text-sm font-medium">
                        {initials}
                      </div>
                    ) : (
                      <BsPerson className="text-2xl" />
                    )}
                  </Button>
                </Popover>
              </div>
            </div>

            {/* Search Bar - Full Width */}
            <div className="py-3 border-t border-gray-100">
              <SearchBar isMobile={true} />
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 bg-white z-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="text-xl font-bold text-[#2C7A7B]">ShopHub</Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#2C7A7B]">
                      <BsX className="text-2xl" />
                    </button>
                  </div>

                  {/* User Info in Mobile Menu */}
                  {session && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Welcome back,</p>
                      <p className="text-lg font-semibold text-[#2C7A7B]">{session.user.name}</p>
                    </div>
                  )}

                  {/* Mobile Menu Items */}
                  <nav className="space-y-4">
                    <Link href="/" className="block text-gray-700 hover:text-[#2C7A7B]">Home</Link>
                    <Link href="/products" className="block text-gray-700 hover:text-[#2C7A7B]">All Products</Link>
                    <Link href="/categories" className="block text-gray-700 hover:text-[#2C7A7B]">Categories</Link>
                    <Link href="/wishlist" className="block text-gray-700 hover:text-[#2C7A7B]">Wishlist</Link>
                    {session ? (
                      <>
                        <Link href="/account" className="block text-gray-700 hover:text-[#2C7A7B]">My Profile</Link>
                        <Link href="/myorders" className="block text-gray-700 hover:text-[#2C7A7B]">My Orders</Link>
                        {session.user.isAdmin && (
                          <Link href="/admin/category" className="block text-gray-700 hover:text-[#2C7A7B]">
                            <div className="flex items-center gap-2">
                              <BsGear className="text-lg" />
                              <span>Admin Dashboard</span>
                            </div>
                          </Link>
                        )}
                        <button 
                          onClick={() => signOut()}
                          className="block w-full text-left text-gray-700 hover:text-[#FC8181]"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/login" className="block text-gray-700 hover:text-[#2C7A7B]">Login</Link>
                    )}
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

