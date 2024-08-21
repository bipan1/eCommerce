'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Button, Input, Popover } from 'antd'
import React from 'react';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react'
import { FaSearch } from "react-icons/fa";
import Profilepage from './ProfilePage';
import { openBag, closeBag } from '@/redux/features/bag-slice';
import { GoPerson } from "react-icons/go";
import { IoBagOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowDown } from "react-icons/io";
import PopOverContent from './popOverContent';
import { getInitials } from 'utils';
import { fetchProducts } from "@/redux/features/products-slice";
import { fetchCategories } from "@/redux/features/category-slice";
import { fetchSearchProducts } from "@/redux/features/searchproducts-slice";
import { getSuggestions } from '@/utils/fuse';
import { IoMdCloseCircleOutline } from "react-icons/io";


export default function Header() {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: products } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput) {
        const results = getSuggestions(searchInput, products);
        setSuggestions(results);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearch = () => {
    dispatch(fetchSearchProducts(searchInput));
    closeSuggestion();
    router.push('/search')
  }

  const closeSuggestion = () => {
    setSearchInput('')
    setSuggestions([]);
  }

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  const { data: session } = useSession()
  const bag = useSelector((state) => state.bag);
  const { numberOfItems, isBagOpen } = bag;

  const handleBagClick = () => {
    if (isBagOpen) {
      dispatch(closeBag())
    } else {
      dispatch(openBag())
    }
  }

  const initials = useMemo(() => {
    return session ? getInitials(session.user.name) : null;
  }, [session?.user])


  const handleMouseLeave = () => {
    closeSuggestion()
  }

  return (
    <div>
      <header
        style={{ backgroundColor: '#4CAF50' }}
        className={`!fixed top-0 shadow-lg text-white left-0 z-[1000] flex w-full items-center`}
      >
        <div className="container !mx-auto">
          <div className="relative flex items-center justify-between">
            <div className="w-40 max-w-full xl:mr-12">
              <Link
                className={`text-[30px] font-extrabold cursor-pointer block p-2`}
                href={'/'}
              >
                NepMart
              </Link>
            </div>

            <Popover content={() => <PopOverContent />} placement='bottom'>
              <div className='w-full flex ml-6 text-lg font-bold hover:cursor-pointer'><p>Shop by Department</p> <IoIosArrowDown className='ml-1 my-auto' /></div>
            </Popover>


            <div className='flex w-full px-4 justify-between'>
              <div className='relative w-full' onMouseLeave={handleMouseLeave}>
                <Input
                  onKeyDown={handleEnterKeyPress}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder='Search for products'
                  type='text'
                  className='!rounded-lg'
                  style={{ width: '35vw' }}
                  size="large"
                  suffix={searchInput.length > 0 ? <IoMdCloseCircleOutline onClick={closeSuggestion} size={20} className="mr-2" /> : <FaSearch className='mr-2' />}
                />
                {suggestions.length > 0 && (
                  <div className="absolute bg-white border text-gray-800 border-gray-300 shadow-lg w-full z-10">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.item.id}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={handleSearch}
                      >
                        {suggestion.item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


            <div className='gap-4 items-center w-full'>
              <div className="ml-10 flex gap-4 space-between items-center justify-end pr-16 lg:pr-0">
                <div onClick={handleBagClick} className="relative mr-3">
                  <IoBagOutline className="cursor-pointer" size={30} />
                  {numberOfItems > 0 && (
                    <span className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs absolute -top-1 -right-1">
                      {numberOfItems}
                    </span>
                  )}
                </div>
                {session ? <Popover content={() => <Profilepage profileinfo={session} />}>
                  <Button className='ml-3' style={{ color: "white", backgroundColor: '#4CAF50' }} size='large' shape="circle">{initials}</Button>
                </Popover> :
                  <Button onClick={() => router.push('/login')} style={{ backgroundColor: '#4CAF50' }} className=' !border-white !text-white !rounded-2xl' size='large' type='primary'>
                    <GoPerson className='inline' />
                    <span className='ml-4'>Login</span>
                  </Button>}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
getInitials