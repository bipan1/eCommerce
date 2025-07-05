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
      <style jsx global>{`
        .custom-carousel .carousel .thumbs-wrapper {
          display: none !important;
        }
        
        .custom-carousel .carousel .control-dots {
          bottom: 10px !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .custom-carousel .carousel .control-dots .dot {
          background: rgba(255, 255, 255, 0.5) !important;
          border-radius: 50% !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 4px !important;
        }
        
        .custom-carousel .carousel .control-dots .dot.selected {
          background: #2C7A7B !important;
        }
        
        @media (max-width: 768px) {
          .custom-carousel .carousel .control-dots {
            bottom: 15px !important;
          }
          
          .custom-carousel .carousel .control-dots .dot {
            width: 8px !important;
            height: 8px !important;
            margin: 0 3px !important;
          }
        }
      `}</style>
      
      <Carousel
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        autoPlay={true}
        interval={3000}
        stopOnHover={true}
        transitionTime={500}
        className="custom-carousel"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              onClick={onClickHandler}
              className="absolute left-2 md:left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/90 hover:bg-[#2C7A7B] hover:text-white text-[#2C7A7B] p-2 md:p-3 rounded-full shadow-lg transition-colors duration-300"
              aria-label={label}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              onClick={onClickHandler}
              className="absolute right-2 md:right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white/90 hover:bg-[#2C7A7B] hover:text-white text-[#2C7A7B] p-2 md:p-3 rounded-full shadow-lg transition-colors duration-300"
              aria-label={label}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )
        }
      >
        {carouselItems.map((item, index) => (
          <div key={index} className="relative h-[240px] xs:h-[260px] sm:h-[320px] md:h-[400px] lg:h-[500px]">
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'center',
                }}
              />
            </div>
            
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0" 
              style={{
                background: `linear-gradient(135deg, ${item.overlayColor} 0%, rgba(0,0,0,0.3) 100%)` 
              }}
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-2xl mx-auto">
                                     {/* Mobile-optimized content */}
                   <div className="md:hidden">
                     <h2 className="text-2xl xs:text-3xl font-bold text-yellow-300 mb-2 drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                       {item.title}
                     </h2>
                     <p className="text-sm xs:text-base text-white font-medium mb-4 drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                       {item.subtitle}
                     </p>
                    <button
                      onClick={() => router.push(item.buttonLink)}
                      className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 bg-[#2C7A7B] hover:bg-[#FC8181] rounded-full shadow-lg"
                    >
                      <span className="relative flex items-center gap-2">
                        {item.buttonText}
                        <FaArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </button>
                  </div>
                  
                                     {/* Desktop content */}
                   <div className="hidden md:block">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-300 mb-4 drop-shadow-2xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
                       {item.title}
                     </h2>
                     <p className="text-lg md:text-xl text-white font-medium mb-6 drop-shadow-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                       {item.subtitle}
                     </p>
                     <p className="text-base text-white/90 mb-8 font-medium drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                       {item.description}
                     </p>
                    <button
                      onClick={() => router.push(item.buttonLink)}
                      className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-[#FC8181] group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                      <span className="absolute inset-0 w-full h-full bg-[#2C7A7B] border border-[#2C7A7B] group-hover:bg-[#FC8181] group-hover:border-[#FC8181]"></span>
                      <span className="relative flex items-center gap-2">
                        {item.buttonText}
                        <FaArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
} 