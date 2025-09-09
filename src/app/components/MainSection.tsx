import React from 'react'
import Image from 'next/image'
import Logo from '../../../public/images/logo.png'
import { Sparkles } from 'lucide-react'

const MainSection = () => {
return (
    <div className='relative flex flex-col justify-center items-center min-h-screen overflow-hidden'>
        {/* Root-like Circuit Background */}
        <div className='absolute inset-0 pointer-events-none'>
            <div className='circuit-roots'></div>
        </div>
        
        <div className='relative z-10'>
            <Image src={Logo} alt='BalitAI Logo' width={350} height={350} />
        </div>

        <div className='relative z-10 flex flex-col items-center justify-center mt-4 gap-4'>
            <h1 className='text-7xl sm:text-xl md:text-7xl font-bold text-white'>BalitAI</h1>
            <p className='text-xs sm:text-xs md:text-lg text-white font-poppins underline underline-offset-8 decoration-yellow-500'>
                Your AI-powered Philippine Corruption News Agent
            </p>
        </div>

        <div className='relative z-10 flex align-items justify-center mt-8'>
            <button className='bg-blue-500 transition-transform duration-300 transform hover:scale-110 border border-2 border-yellow-500 text-xs sm:text-base md:text-2xl hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                AI News Scan
                <Sparkles className='inline-block ml-2 text-yellow-500' />
            </button>
        </div>
    </div>
)
}

export default MainSection
