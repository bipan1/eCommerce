'use client'
import { Button, Card, Carousel } from 'antd';
import { catergories } from '@/utils';
import { useRouter } from 'next/navigation';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";


const SampleNextArrow = props => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        color: 'gray',
        fontSize: '15px',
        lineHeight: '1.5715'
      }}
      onClick={onClick}
    >
      <FaArrowAltCircleRight size={20} />
    </div>
  )
}

const SamplePrevArrow = props => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{
        ...style,
        color: 'gray',
        fontSize: '15px',
        lineHeight: '1.5715'
      }}
      onClick={onClick}
    >
      <FaArrowAltCircleLeft size={20} />
    </div>
  )
}

const settings = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />
}


export default function Home() {

  const router = useRouter();


  return <div>
    <div className='mt-20 flex w-full h-12 p-4 bg-gray-200 z-[1000] shadow-lg'>
      <ul className='flex w-full space-between items-center justify-center'>
        {catergories.map(category => <li onClick={() => router.push(`/posts/${category.label.toLocaleLowerCase()}`)} className='mx-8 hover:text-blue-400 hover:cursor-pointer' key={category.label}>
          {category.label}
        </li>)}
      </ul>
    </div>
    <div className='relative z-[10] overflow-hidden px-20 mx-20'>
      <Carousel autoplay arrows {...settings}>
        <div>
          <div className='h-100 w-100 relative'>
            <img className='h-full-max w-full object-cover' src={`/carosuel1.png`} />
            <div className='shadow-lg absolute top-40 left-40 w-96 h-24'>
              <Card>
                <h2 className='mb-2 text-xl font-bold'>Everything Nepalese</h2>
                <p>Get access to everything nepalese. Business to community all in one place.</p>
                <Button className='mt-4 bg-blue-400 border border-blue' type="primary">Explore</Button>
              </Card>
            </div>
          </div>
        </div>

        <div>
          <div className='h-100 w-100 relative'>
            <img className='h-full-max w-full object-cover' src={`/carosuel.png`} />
            <div className='shadow-lg absolute top-40 left-40 w-96 h-24'>
              <Card>
                <h2 className='mb-2 text-xl font-bold'>Create your shop today.</h2>
                <p>Create your shop with us and start your venture today. We will take care of everything.</p>
                <Button onClick={() => router.push('/shop')} className='mt-4 bg-blue-400 border border-blue' type="primary">Create Shop</Button>
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
