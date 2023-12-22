'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button, Input, Popover } from 'antd'
import React from 'react';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react'
import { FaPlus } from "react-icons/fa6";
import { SearchOutlined } from '@ant-design/icons'
import { BiMessageDetail } from 'react-icons/bi';
import { MdNotificationsNone } from 'react-icons/md'
import { GiShoppingCart } from "react-icons/gi";
import Profilepage from './ProfilePage';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { openBag } from '../../redux/features/bag-slice';


export default function Header() {
  const [sticky, setSticky] = useState(false)
  const [navbarOpen, setNavbarOpen] = useState(false)

  const router = useRouter();

  const { data: session } = useSession()
  console.log(session)
  const dispatch = useAppDispatch();

  const bag = useAppSelector((state) => state.bag);
  const { numberOfItems } = bag;

  const handleStickyNavbar = () => {
    if (window.screenY >= 80) setSticky(true)
    else setSticky(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar)
  })

  return (
    <div>
      <header
        className={`bg-white top-0 h-20 border-b border-black-600 left-0 z-[1000] flex w-full items-center
     ${sticky
            ? '!fixed !z-[10000] !bg-white !bg-opacity-80 shadow-sticky backdrop:blur-sm !transition'
            : 'absolute'
          }
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

            <div className='flex w-full px-4 justify-between'>
              <Input style={{ width: '40vw' }} size="large" prefix={<SearchOutlined />} placeholder='Search for everything' />
            </div>

            {session && <div className="ml-10 flex gap-8 w-full space-between">
              <BiMessageDetail className='cursor-pointer' size={30} />
              <MdNotificationsNone className='cursor-pointer' size={30} />
            </div>}

            {session && <div onClick={() => dispatch(openBag())} className="relative">
              <GiShoppingCart className="cursor-pointer" size={30} />
              {numberOfItems > 0 && (
                <span className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs absolute -top-1 -right-1">
                  {numberOfItems}
                </span>
              )}
            </div>}

            <div className='ml-10 flex gap-4 items-center'>
              {session ? <div className="ml-4 flex gap-4 space-between items-center justify-end pr-16 lg:pr-0">
                <Button className='border border-black' onClick={() => router.push('/posts')} type='secondary'><FaPlus className='inline' /><span className='ml-4'>Create Post</span></Button>
                <Popover content={() => <Profilepage profileinfo={session} />}>
                  <Button style={{ color: "white", backgroundColor: "black" }} size='large' shape="circle">BC</Button>
                </Popover>
              </div> :
                <div className="flex items-center justify-end pr-16 lg:pr-0">
                  <Button type='default' onClick={() => router.push('/login')}>Login</Button>
                  <Button className='ml-5' type='default' onClick={() => router.push('/signup')}>Signup</Button>
                </div>
              }
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
