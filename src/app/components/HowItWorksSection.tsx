import React from 'react'
import { Lightbulb } from 'lucide-react'
import { cardData } from '../constants/cardData'
import { useAOS } from '../hooks/useAOS';

const HowItWorksSection = () => {
  useAOS();

  return (
   <section 
   data-aos="fade-up"
   className='min-h-screen p-4 flex flex-col items-center justify-center'>
     <div className='flex align-items justify-center mb-4'>
         <h2 className='text-4xl text-white font-bold mb-4'>How It Works</h2>
         <Lightbulb className='inline-block font-bold ml-2 w-12 h-8 text-yellow-500'/>
     </div>
    
        <p className='text-sm sm:text-sm md:text-lg text-white'>
          Our AI-powered system scans and analyzes news articles in numerous news <br />platforms to provide you with the latest updates 
          on corruption in the Philippines.
        </p>

     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 mt-4'>
      {cardData.map(({cardId, title, description, icon: Icon}, index) => (
        <div
        key={cardId}
        className='bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105'
        >
          <div className='flex flex-col items-center text-center mb-4'>
            <Icon className='w-12 h-12 text-blue-500 mb-2' />
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h3>
            <p className='text-gray-600 text-sm'>{description}</p>
          </div>

        </div>
      ))}
     </div>

   </section>
  )
}

export default HowItWorksSection
