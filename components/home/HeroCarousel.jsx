'use client'

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { FaArrowRight } from 'react-icons/fa';

const carouselItems = [
  {
    image: '/carousel/hero1.png',
    title: 'Fresh Produce',
    subtitle: 'Quality Groceries Delivered to Your Door',
    description: 'Shop our wide range of fresh fruits, vegetables, and groceries',
    buttonText: 'Shop Now',
    buttonLink: '/products/categories/1',
    overlayColor: 'rgba(44, 122, 123, 0.2)'
  },
  {
    image: '/carousel/hero2.png',
    title: 'Special Offers',
    subtitle: 'Up to 50% Off on Selected Items',
    description: 'Limited time offers on your favorite products',
    buttonText: 'View Specials',
    buttonLink: '/specials',
    overlayColor: 'rgba(252, 129, 129, 0.15)'
  },
  {
    image: '/carousel/hero3.png',
    title: 'Fast Delivery',
    subtitle: 'Same Day Delivery Available',
    description: 'Order by 4 PM for same day delivery',
    buttonText: 'Learn More',
    buttonLink: '/delivery',
    overlayColor: 'rgba(44, 122, 123, 0.2)'
  }
];

export default function HeroCarousel() {
  const router = useRouter();

  return (
    <div className="relative">
      <Carousel
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={true}
        transitionTime={500}
        className="custom-carousel"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              onClick={onClickHandler}
              className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/90 hover:bg-[#2C7A7B] hover:text-white text-[#2C7A7B] p-2 rounded-full shadow-lg transition-colors duration-300"
              aria-label={label}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              onClick={onClickHandler}
              className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/90 hover:bg-[#2C7A7B] hover:text-white text-[#2C7A7B] p-2 rounded-full shadow-lg transition-colors duration-300"
              aria-label={label}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )
        }
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="relative h-[200px] xs:h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
            <div
              className="absolute inset-0" 
              style={{
                background: `linear-gradient(to right, ${item.overlayColor}, rgba(0,0,0,0.1))` 
              }}
            />
            <div className="relative w-full h-full">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain md:object-cover"
                style={{
                  objectPosition: 'center',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-3 sm:px-4 text-center">
                <div className="max-w-2xl mx-auto px-2 sm:px-6">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A365D] mb-1 sm:mb-4 drop-shadow-sm">
                    {item.title}
                  </h2>
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#2D3748] font-medium mb-2 sm:mb-6 drop-shadow-sm">
                    {item.subtitle}
                  </p>
                  <p className="text-xs xs:text-sm sm:text-base text-[#4A5568] mb-3 sm:mb-8 font-medium drop-shadow-sm hidden sm:block">
                    {item.description}
                  </p>
                  <button
                    onClick={() => router.push(item.buttonLink)}
                    className="group relative inline-flex items-center justify-center px-4 sm:px-8 py-1.5 sm:py-3.5 text-xs xs:text-sm sm:text-base font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-[#FC8181] group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                    <span className="absolute inset-0 w-full h-full bg-[#2C7A7B] border border-[#2C7A7B] group-hover:bg-[#FC8181] group-hover:border-[#FC8181]"></span>
                    <span className="relative flex items-center gap-1 sm:gap-2">
                      {item.buttonText}
                      <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
} 