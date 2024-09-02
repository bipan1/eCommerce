'use client'

import { useSelector } from 'react-redux';
import ProductDisplay from "components/products/productDisplay";
import { Carousel } from 'react-responsive-carousel';
import Slider from "react-slick";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Slidersettings } from '@/utils/sliderUtils';

export default function Home() {
  const { data: products, specials } = useSelector((state) => state.products);
  const { data: categories } = useSelector((state) => state.category);

  const router = useRouter();

  const categoryProductsMap = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(product => product.categoryId === category.id);
    return acc;
  }, {});


  return <div>
    <Carousel infiniteLoop={true} showThumbs={false} transitionTime={500} className="custom-carousel" autoPlay={true}>
      <div className="image-container">
        <img src="new3.jpeg" className="carousel-image" />
      </div>
      <div className="image-container" >
        <img src="new2.webp" className="carousel-image" />
      </div>
    </Carousel>


    <div className='mt-10 relative z-[10] overflow-hidden px-4 sm:px-8 md:px-12 lg:px-20 mx-auto'>
      <div className='md:px-20 lg:px-40'>
        <div className="flex items-center justify-between">
          <div className="float-left">
            <h2 className="text-2xl font-bold relative">
              Our Specials
              <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-900"></div>
            </h2>
          </div>
          <div onClick={() => router.push(`/specials`)} className="hover:cursor-pointer text-blue-900 hover:text-green-900 flex text-lg items-center">
            <p className="mr-2">See all</p>
            <FaArrowRight />
          </div>
        </div>

        <div className="mb-10">
          <Slider {...Slidersettings} >
            {specials.map(product => {
              return <div className="ml-10 md:ml-0 lg:ml-0">
                <ProductDisplay product={product} />
              </div>
            })}
          </Slider>
        </div>
      </div>

      <div>
        {categories.map(cat => (
          <div className='md:px-20 lg:px-40'>
            {
              categoryProductsMap[cat.id].length > 0 && <>
                <div className="flex mt-5 items-center justify-between mb-4">
                  < div className="float-left" >
                    <h2 className="text-2xl font-bold relative">
                      {cat.name}
                      <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-900"></div>
                    </h2>
                  </div>
                  <div onClick={() => router.push(`/products/categories/${cat.id}`)} className="hover:cursor-pointer text-blue-900 hover:text-green-900 text-lg flex items-center">
                    <p className="mr-2">See all</p>
                    <FaArrowRight />
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
                  {categoryProductsMap[cat.id].map(product => {
                    return <div>
                      <ProductDisplay product={product} />
                    </div>
                  })}
                </div>
              </>}
          </div>
        ))
        }
      </div >
    </div >
  </div >
}
