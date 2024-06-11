import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './Carousel.css';

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';

import tagging from '../../assets/images/tagging.png'
import customer from '../../assets/images/customer.png'
import leadEnrich from '../../assets/images/leadEnrich.png'
import leadRouting from '../../assets/images/leadRouting.png'

const Carousel = () => {
  return (
    <div className='border px-5'>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={false}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className='flex justify-center items-center gap-4 h-full bg-[#609DA1] text-white text-xl'>
            <div>
              <img src={leadRouting} alt="leadRouting" />
            </div>
            <div>Lead Routing</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='flex justify-center items-center gap-4 h-full bg-[#E07E65] text-white text-lg'>
            <div>
              <img src={leadEnrich} alt="leadEnrich" />
            </div>
            <div>Lead Enrichment</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='flex justify-center items-center gap-4 h-full bg-indigo-200 text-lg'>
            <div>
              <img src={customer} alt="customer" />
            </div>
            <div>Customer Success</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='flex justify-center items-center gap-4 h-full bg-red-100 text-lg'>
            <div>
              <img src={tagging} alt="tagging" />
            </div>
            <div>Tagging Agent</div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
