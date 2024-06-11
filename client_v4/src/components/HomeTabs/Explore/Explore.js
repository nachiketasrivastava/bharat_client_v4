import React from 'react'

import questionImg from '../../../assets/images/questionImg.png';
import appImg from '../../../assets/images/appImg.png';
import leadsImg from '../../../assets/images/leadsImg.png';
import enrichImg from '../../../assets/images/enrichImg.png';
import reportImg from '../../../assets/images/reportImg.png';
// import funnelImg from '../../../assets/images/funnelImg.png';

const Explore = () => {
  const firstData = [
    {
      image: questionImg,
      title: "Ask Questions"
    },
    {
      image: appImg,
      title: "Launch an App"
    },
    {
      image: leadsImg,
      title: "Discover Audience"
    }
  ]

  const secondData = [
    {
      image: enrichImg,
      title: "List Management"
    },
    {
      image: reportImg,
      title: "Insights"
    },
    // {
    //   image: funnelImg,
    //   title: "Full Funnel Analytics"
    // }
  ]

  return (
    <div className='flex flex-col w-full h-[80vh] justify-center items-center gap-10'>
      <div className='w-full flex justify-center flex-wrap items-center gap-12'>
        {firstData.map((data, index) => (
          <div key={index} className='flex flex-col justify-center items-center w-[20%] bg-gray-100 rounded-md pt-10 pb-2 gap-6 cursor-pointer shadow-lg hover:shadow-2xl duration-300 ease-in-out hover:scale-105'>
            <img src={data.image} alt={data.title} className='w-[60%]' />
            <p className='text-md font-semibold'>{data.title}</p>
          </div>
        ))}
      </div>
      <div className='w-full flex justify-center flex-wrap items-center gap-12'>
        {secondData.map((data, index) => (
          <div key={index} className='flex flex-col justify-center items-center w-[20%] bg-gray-100 rounded-md pt-10 pb-2 gap-6 cursor-pointer shadow-lg hover:shadow-2xl duration-300 ease-in-out hover:scale-105'>
            <img src={data.image} alt={data.title} className='w-[60%]' />
            <p className='text-md font-semibold'>{data.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explore