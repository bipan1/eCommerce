import Image from 'next/image'
import { Button, Card, Carousel } from 'antd';
import { catergories } from '@/utils';
import './globals.css'


export default function Home() {
  return <div>
    <div className='mt-20 flex w-full h-12 p-4 bg-gray-200 z-[1000] shadow-lg'>
      <ul className='flex w-full space-between items-center justify-center'>
        {catergories.map(category => <li className='mx-8 hover:text-blue-400 hover:cursor-pointer' id={category.id}>
          {category.label}
        </li>)}
      </ul>
    </div>
    <div className='relative z-[10] overflow-hidden px-20 mx-20'>
      <Carousel autoplay>
        <div>
          <div className='h-100 w-100 relative'>
            <img className='max-w-full max-h-full' src="/carosuel1.png" />
            <div className='shadow-lg absolute top-40 left-40 w-96 h-24'>
              <Card>
                <h2 className='mb-2 text-xl font-bold'>Everything Nepalese</h2>
                <p>Get access to everything nepalese. Business to community all in one place.</p>
              </Card>
            </div>
          </div>
        </div>

        <div>
          <div className='h-100 w-100 relative'>
            <img className='max-w-full max-h-full' src="/carosuel.jpg" />
            <div className='shadow-lg absolute top-40 left-40 w-96 h-24'>
              <Card>
                <h2 className='mb-2 text-xl font-bold'>Create you shop today.</h2>
                <p>Create your shop with us and start your venture today. We will take care of everything.</p>
                <Button className='mt-4' type="primary">Create Shop</Button>
              </Card>
            </div>
          </div>
        </div>
      </Carousel>
    </div>

    <div className='block pt-5 text-gray-600 mt-10 font-medium  bg-gray-200 h-40 w-full'>
      <p className='text-center'>Trusted by many nepalses businesses around the world.</p>
    </div>
  </div>
}
