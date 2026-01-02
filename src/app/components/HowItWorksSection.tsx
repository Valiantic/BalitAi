import React from 'react'
import { Lightbulb } from 'lucide-react'
import { cardData } from '../constants/cardData'
import { useAOS } from '../hooks/useAOS';

const HowItWorksSection = () => {
  useAOS();

  return (
    <section
      data-aos="fade-up"
      className='min-h-screen py-16 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a2942] to-[#0f1f3a]'>
      <div className='flex items-center justify-center mb-6 gap-3'>
        <h2 className='text-3xl sm:text-4xl md:text-5xl text-white font-bold'>Why BalitAI?</h2>
        <Lightbulb className='w-10 h-10 md:w-12 md:h-12 text-yellow-400' />
      </div>

      <p className='text-sm sm:text-base md:text-lg text-gray-300 text-center mb-12 max-w-3xl'>
        Leveraging advanced AI models trained on local Philippine content to monitor, analyze,<br className='hidden md:block' />
        and debunk corruption narratives.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl w-full'>
        {cardData.map(({ cardId, title, description, icon: Icon }) => (
          <div
            key={cardId}
            data-aos="fade-up"
            data-aos-delay={cardId * 100}
            className='group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 border border-slate-700/50 hover:border-blue-500/50'
          >
            <div className='flex flex-col items-center text-center'>
              <div className='bg-blue-500/10 p-4 rounded-full mb-4 group-hover:bg-blue-500/20 transition-colors duration-300'>
                <Icon className='w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300' />
              </div>
              <h3 className='text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300'>
                {title}
              </h3>
              <p className='text-gray-300 text-sm leading-relaxed'>
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default HowItWorksSection
