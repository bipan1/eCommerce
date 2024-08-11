'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button, Input, Popover } from 'antd'
import React from 'react';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react'
import { FaSearch } from "react-icons/fa";
import Profilepage from './ProfilePage';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { openBag } from '@/redux/features/bag-slice';
import { GoPerson } from "react-icons/go";
import { IoBagOutline } from "react-icons/io5";

export default function Header() {
  const [sticky, setSticky] = useState(false)
  const router = useRouter();

  const { data: session } = useSession()
  const dispatch = useAppDispatch();
  const bag = useAppSelector((state) => state.bag);
  const { numberOfItems } = bag;

  const handleStickyNavbar = () => {
    if (window.scrollY > 80) {
      setSticky(true)
    }
    else {
      setSticky(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar)
  })

  return (
    <div>
      <header
        style={{ backgroundColor: '#4CAF50' }}
        className={` text-white top-0 border-b border-black-600 left-0 z-[1000] flex w-full items-center
          ${sticky ? '!fixed !z-[10000] shadow-sticky backdrop:blur-sm !transition !duration-700' : 'absolute'}
    `}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                className={`text-[30px] font-extrabold cursor-pointer block w-full
                ${sticky ? 'py-5 lg:py-2' : 'py-8'}
                `}
                href={'/'}
              >
                NepMart
              </Link>
            </div>

            <div className='mainsearch flex w-full px-4 justify-between'>
              <Input placeholder='Search for...' type='text' className=' !rounded-2xl' style={{ width: '40vw', backgroundColor: '#4CAF50' }} size="large" prefix={<FaSearch className='mr-2' color={'white'} />} />
            </div>

            <div className='gap-4 items-center w-full'>
              <div className="ml-10 flex gap-4 space-between items-center justify-end pr-16 lg:pr-0">
                <div onClick={() => dispatch(openBag())} className="relative mr-3">
                  <IoBagOutline className="cursor-pointer" size={30} />
                  {numberOfItems > 0 && (
                    <span className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs absolute -top-1 -right-1">
                      {numberOfItems}
                    </span>
                  )}
                </div>
                {session ? <Popover content={() => <Profilepage profileinfo={session} />}>
                  <Button className='ml-3' style={{ color: "white", backgroundColor: '#4CAF50' }} size='large' shape="circle">BC</Button>
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
