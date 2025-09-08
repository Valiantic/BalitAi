import React from 'react'
import Image from 'next/image'
import Logo from '../../../public/images/logo.png'

const MainSection = () => {
return (
    <div className='flex flex-col justify-center items-center'>
        <Image src={Logo} alt='BalitAI Logo' width={350} height={350} />

        <div className='flex items-center justify-center mt-4'>
            <h1 className='text-7xl sm:text-xl md:text-7xl font-bold text-white'>BalitAI</h1>
        </div>
    </div>
)
}

export default MainSection
