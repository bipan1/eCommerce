'use client'

import { useSelector } from 'react-redux';
import ProductDisplay from "components/products/productDisplay";
import { Carousel } from 'react-responsive-carousel';
import Slider from "react-slick";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: products, specials } = useSelector((state) => state.products);
  const { data: categories } = useSelector((state) => state.category);

  const router = useRouter();

  const categoryProductsMap = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(product => product.categoryId === category.id);
    return acc;
  }, {});

  const settings = {
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };


  return <div>
    <Carousel infiniteLoop={true} showThumbs={false} transitionTime={500} className="custom-carousel" autoPlay={true}>
      {/* <div className="image-container">
        <img src="new1.png" className="carousel-image" />
      </div> */}
      <div className="image-container">
        <img src="new3.jpeg" className="carousel-image" />
      </div>
      <div className="image-container" >
        <img src="new2.webp" className="carousel-image" />
      </div>
    </Carousel>
    <div className='mt-10 relative z-[10] overflow-hidden lg:px-20 lg:mx-20 md:px-10 md:mx-10 sm:px-5 sm:mx-5'>
      <div>
        <div className="flex items-center justify-between">
          <div className="float-left">
            <h2 className="text-2xl font-bold relative">
              Our Specials
              <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-600"></div>
            </h2>
          </div>
          <div onClick={() => router.push(`/specials`)} className="hover:cursor-pointer text-blue-600 flex items-center">
            <p className="mr-2">See all</p>
            <FaArrowRight />
          </div>
        </div>

        <div className="mb-10 mx-auto">
          <Slider {...settings} >
            {specials.map(product => {
              return <div>
                <ProductDisplay product={product} />
              </div>
            })}
          </Slider>
        </div>
      </div>

      <div>
        {categories.map(cat => (
          <>
            {
              categoryProductsMap[cat.id].length > 0 && <>
                <div className="flex mt-5 items-center justify-between">
                  <div className="float-left">
                    <h2 className="text-2xl font-bold relative">
                      {cat.name}
                      <div className="custom-width mb-4 mt-1 h-[2px] rounded-md bg-green-600"></div>
                    </h2>
                  </div>
                  <div onClick={() => router.push(`/products/categories/${cat.id}`)} className="hover:cursor-pointer text-blue-600 flex items-center">
                    <p className="mr-2">See all</p>
                    <FaArrowRight />
                  </div>

                </div>
                <div className="mx-auto lg:gap-6 grid items-center py-4 grid-cols-2 sm:gap-2 md:gap-3 lg:grid-cols-5">
                  {categoryProductsMap[cat.id].map(product => {
                    return <div>
                      <ProductDisplay product={product} />
                    </div>
                  })}
                </div>
              </>}
          </>
        ))}
      </div>
    </div>
  </div >
}
