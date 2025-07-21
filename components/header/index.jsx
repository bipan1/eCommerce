'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, Fragment, useRef, useCallback } from 'react'
import { Button, Input, Popover, Menu, Dropdown } from 'antd'
import React from 'react';
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from 'next-auth/react'
import { FaSearch, FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BsBoxSeam, BsChevronDown, BsTruck, BsClock, BsStar, BsShield, BsCart, BsList, BsX, BsGrid, BsChevronRight, BsSearch, BsPerson, BsLightningCharge, BsTrophy, BsGear } from "react-icons/bs";
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
import ProfilePopover from './ProfilePopover';
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import Spinner from '@/components/spinner';
import { RiAccountCircleLine } from "react-icons/ri";
import { axiosApiCall } from 'utils/axiosApiCall';
import { useNotification } from '../notification/NotificationProvider';

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
  const { showNotification } = useNotification();

  // Local state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const searchRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

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
        // Check if click is on a dropdown suggestion (Link element)
        const clickedElement = event.target.closest('a[href]');
        if (clickedElement && clickedElement.href.includes('/products/') || clickedElement && clickedElement.href.includes('/search?q=')) {
          // Delay closing to allow navigation to complete
          setTimeout(() => {
            setShowSuggestions(false);
          }, 100);
        } else {
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only proceed if we have a search query
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchLoading(false);
      return;
    }

    // Don't search for single characters
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchLoading(false);
      return;
    }

    // Set new timeout with proper debouncing (1.5 seconds)
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await axiosApiCall(`/search?q=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        const searchResults = response.data.products || [];
        setSuggestions(searchResults);
        setShowSuggestions(searchResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    }, 1000); // 1 second debounce - wait for user to stop typing

    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = useCallback((e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const handleSuggestionClick = useCallback((product, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const url = `/products/${product.id}`;
    
    setShowSuggestions(false);
    setSearchQuery('');
    
    // Use router.push with error handling
    try {
      router.push(url);
    } catch (error) {
      console.error('Router push failed, using window.location:', error);
      try {
        window.location.href = url;
      } catch (e) {
        console.error('Both router.push and window.location.href failed:', e);
      }
    }
  }, [router]);

  const handleViewAllResults = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const url = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    
    setShowSuggestions(false);
    setSearchQuery('');
    
    // Use router.push with error handling
    try {
      router.push(url);
    } catch (error) {
      console.error('Router push failed, using window.location:', error);
      try {
        window.location.href = url;
      } catch (e) {
        console.error('Both router.push and window.location.href failed:', e);
      }
    }
  }, [searchQuery, router]);

  const handleTrackOrderClick = () => {
    if (session) {
      router.push('/myorders');
    } else {
      showNotification('Please sign in to track your orders', 'info');
    }
  };

  const handleLogout = () => {
    // Check if user is on a protected route that needs redirect to home
    const protectedRoutes = ['/myorders', '/account', '/admin']
    const currentPath = window.location.pathname
    const isOnProtectedRoute = protectedRoutes.some(route => 
      currentPath.startsWith(route)
    )
    
    if (isOnProtectedRoute) {
      signOut({ callbackUrl: window.location.origin })
    } else {
      signOut()
    }
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
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <BsPerson />,
      onClick: () => {
        // Check if user is on a protected route that needs redirect to home
        const protectedRoutes = ['/myorders', '/account', '/admin']
        const currentPath = window.location.pathname
        const isOnProtectedRoute = protectedRoutes.some(route => 
          currentPath.startsWith(route)
        )
        
        if (isOnProtectedRoute) {
          signOut({ callbackUrl: window.location.origin })
        } else {
          signOut()
        }
      },
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

  // Optimized SearchBar render
  const renderSearchBar = useCallback((isMobile = false) => (
    <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-2xl mx-4'}`} ref={searchRef}>
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
      {(showSuggestions || searchLoading) && (
        <div className="absolute z-[9999] w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto pointer-events-auto">
          {searchLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2C7A7B]"></div>
              <span className="ml-2 text-sm text-gray-500">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
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
                    <p className="text-xs text-gray-500">
                      {product.categoryName && product.subcategoryName 
                        ? `${product.categoryName} › ${product.subcategoryName}`
                        : product.categoryName || 'Product'
                      }
                    </p>
                  </div>
                  <div className="text-sm font-medium text-[#2C7A7B]">
                    ${product.price}
                  </div>
                </Link>
              ))}
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                  className="w-full block text-center text-sm text-[#2C7A7B] hover:text-[#FC8181] font-medium py-1"
                >
                  View all results
                </Link>
              </div>
            </>
          ) : searchQuery.length > 1 && !searchLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <p className="text-sm">No products found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try different keywords or check spelling</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  ), [searchQuery, suggestions, searchLoading, showSuggestions, handleSearch, handleSuggestionClick, handleViewAllResults]);

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
                <span className="whitespace-nowrap">Free Shipping on Orders Over $100</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <BsTruck className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <BsShield className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Mobile Top Bar - Carousel */}
          <div className="md:hidden py-1.5">
            <div className="relative overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                <div className="flex items-center space-x-2 mx-4">
                  <MdOutlineLocalShipping className="text-base" />
                  <span className="text-xs">Free Shipping on Orders Over $100</span>
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
        <div className="container mx-auto px-2 lg:px-4">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between py-2">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img 
                  src="/finalfinallogo.png" 
                  alt="Sathiko Kirana Pasal Logo" 
                  className="h-20 w-auto object-contain brightness-110 contrast-125"
                />
              </Link>

              {/* Search Bar */}
              {renderSearchBar(false)}

              {/* Navigation Icons */}
              <div className="flex items-center space-x-4">
                {session && (
                  <div className="hidden lg:block text-right mr-1">
                    <p className="text-xs text-gray-600">Welcome back,</p>
                    <p className="text-xs font-semibold text-[#2C7A7B]">{session.user.name}</p>
                  </div>
                )}
                
                {/* Custom Profile Popover */}
                <div className="relative">
                  <button
                    ref={profileTriggerRef}
                    onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
                    className="flex items-center gap-2 text-[#2C7A7B] bg-transparent hover:text-[#FC8181] border-none shadow-none p-0 transition-colors duration-300"
                  >
                    {session ? (
                      <div className="w-8 h-8 rounded-full bg-[#2C7A7B] text-white flex items-center justify-center text-sm font-medium">
                        {initials}
                      </div>
                    ) : (
                      <BsPerson className="text-2xl" />
                    )}
                  </button>
                  
                  <ProfilePopover
                    isOpen={isProfilePopoverOpen}
                    onClose={() => setIsProfilePopoverOpen(false)}
                    triggerRef={profileTriggerRef}
                  />
                </div>


                <button onClick={handleBagClick} className="relative group">
                  <BsCart className="text-2xl text-[#2C7A7B] group-hover:text-[#FC8181] transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FC8181] text-white text-xs rounded-full flex items-center justify-center">{numberOfItems}</span>
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="border-t border-gray-100">
              <div className="flex items-center py-3">
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
                  <button 
                    onClick={handleTrackOrderClick}
                    className="text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300 bg-transparent border-none cursor-pointer font-medium"
                  >
                    Track Order
                  </button>
                  <Link href="/contact" className="text-[#2C7A7B] hover:text-[#FC8181] transition-colors duration-300 font-medium">
                    Contact Us
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
              
              <Link href="/" className="flex items-center">
                <img 
                  src="/finalfinallogo.png" 
                  alt="Sathiko Kirana Pasal Logo" 
                  className="h-16 w-auto object-contain brightness-110 contrast-125"
                />
              </Link>
              
              <div className="flex items-center space-x-4">
                <button onClick={handleBagClick} className="relative">
                  <BsCart className="text-2xl text-[#2C7A7B]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FC8181] text-white text-xs rounded-full flex items-center justify-center">{numberOfItems}</span>
                </button>
                
                {/* Custom Profile Popover for Mobile */}
                <div className="relative">
                  <button
                    ref={profileTriggerRef}
                    onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
                    className="flex items-center gap-2 text-[#2C7A7B] bg-transparent hover:text-[#FC8181] border-none shadow-none p-0 transition-colors duration-300"
                  >
                    {session ? (
                      <div className="w-8 h-8 rounded-full bg-[#2C7A7B] text-white flex items-center justify-center text-sm font-medium">
                        {initials}
                      </div>
                    ) : (
                      <BsPerson className="text-2xl" />
                    )}
                  </button>
                  
                  <ProfilePopover
                    isOpen={isProfilePopoverOpen}
                    onClose={() => setIsProfilePopoverOpen(false)}
                    triggerRef={profileTriggerRef}
                  />
                </div>
              </div>
            </div>

            {/* Search Bar - Full Width */}
            <div className="py-3 border-t border-gray-100">
              {renderSearchBar(true)}
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] z-50">
                <div className="p-4 h-full overflow-y-auto">
                  <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                      <img 
                        src="/finalfinallogo.png" 
                        alt="Sathiko Kirana Pasal Logo" 
                        className="h-20 w-auto object-contain brightness-110 contrast-125"
                      />
                    </Link>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="p-2 text-[#2C7A7B] hover:text-[#FC8181] hover:bg-white rounded-lg transition-all duration-300"
                    >
                      <BsX className="text-2xl" />
                    </button>
                  </div>

                  {/* Mobile Menu Items - Enhanced with Theme Colors */}
                  <nav className="space-y-6">
                    {/* Shop Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                      <div className="bg-gradient-to-r from-[#2C7A7B] to-[#38B2AC] p-4">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                          <BsGrid className="text-xl" />
                          Shop
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <Link 
                          href="/" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-[#2C7A7B] rounded-lg flex items-center justify-center group-hover:bg-[#FC8181] transition-colors duration-300">
                            <span className="text-white font-bold">H</span>
                          </div>
                                                    <span className="font-medium">Home</span>
                        </Link>
                        <Link 
                          href="/categories" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-[#2C7A7B] rounded-lg flex items-center justify-center group-hover:bg-[#FC8181] transition-colors duration-300">
                            <BsGrid className="text-white text-lg" />
                          </div>
                          <span className="font-medium">Categories</span>
                        </Link>
                        <Link 
                          href="/flash-deals" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-[#FC8181] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                            <BsLightningCharge className="text-white text-lg" />
                          </div>
                          <span className="font-medium">Flash Deals</span>
                        </Link>
                      </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                      <div className="bg-gradient-to-r from-[#FC8181] to-[#F687B3] p-4">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                          <BsShield className="text-xl" />
                          Quick Links
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <button 
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleTrackOrderClick();
                          }}
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group w-full bg-transparent border-none cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-[#FC8181] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                            <BsBoxSeam className="text-white text-lg" />
                          </div>
                          <span className="font-medium">Track Order</span>
                        </button>
                        <Link 
                          href="/contact" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-[#FC8181] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                            <span className="text-white font-bold text-sm">C</span>
                          </div>
                          <span className="font-medium">Contact Us</span>
                        </Link>

                      </div>
                    </div>

                    {/* Authentication Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-4">
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                          <BsPerson className="text-xl" />
                          {session ? 'Account' : 'Sign In'}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {session ? (
                          // Logged in user options
                          <>
                            <Link 
                              href="/account" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                            >
                              <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                                <BsPerson className="text-white text-lg" />
                              </div>
                              <span className="font-medium">My Profile</span>
                            </Link>
                            <Link 
                              href="/myorders" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                            >
                              <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                                <BsBoxSeam className="text-white text-lg" />
                              </div>
                              <span className="font-medium">My Orders</span>
                            </Link>
                            <button 
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                              }}
                              className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#FC8181] hover:bg-[#FFF5F5] rounded-lg transition-all duration-300 group w-full bg-transparent border-none cursor-pointer"
                            >
                              <div className="w-8 h-8 bg-[#FC8181] rounded-lg flex items-center justify-center group-hover:bg-[#E53E3E] transition-colors duration-300">
                                <span className="text-white font-bold text-sm">↗</span>
                              </div>
                              <span className="font-medium">Logout</span>
                            </button>
                          </>
                        ) : (
                          // Guest user options
                          <>
                            <Link 
                              href="/login" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                            >
                              <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                                <BsPerson className="text-white text-lg" />
                              </div>
                              <span className="font-medium">Login</span>
                            </Link>
                            <Link 
                              href="/signup" 
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 p-3 text-gray-700 hover:text-[#2C7A7B] hover:bg-[#E6FFFA] rounded-lg transition-all duration-300 group"
                            >
                              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center group-hover:bg-[#2C7A7B] transition-colors duration-300">
                                <span className="text-white font-bold text-sm">+</span>
                              </div>
                              <span className="font-medium">Sign Up</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

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

