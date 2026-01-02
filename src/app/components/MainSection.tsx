'use client';

import React from 'react'
import Image from 'next/image'
import PhilippineMap from '../../../public/images/philippine_map.png'
import { Search, AlertCircle } from 'lucide-react'
import { MainSectionProps } from '../types/mainsection';
import { useAOS } from '../hooks/useAOS';

const MainSection: React.FC<MainSectionProps> = ({
    onScanNews,
    loading,
    error,
    onClearError
}) => {
    const handleScanClick = async () => {
        if (loading) return;

        try {
            await onScanNews();
        } catch (err) {
            console.error('Error scanning news:', err);
        }
    };

    useAOS();

    return (
        <div
            data-aos="zoom-in"
            className='relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#1a2942]'>
            {/* Animated Philippine Map Background */}
            <div className='absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center'>
                <div className='relative w-full h-full max-w-2xl animate-pulse-slow'>
                    <Image
                        src={PhilippineMap}
                        alt='Philippine Map'
                        fill
                        className='object-contain'
                        priority
                    />
                </div>
            </div>

            {/* Animated particles/dots */}
            <div className='absolute inset-0 pointer-events-none'>
                <div className='floating-particles'></div>
            </div>

            {/* Main Content */}
            <div className='relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl'>
                <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight'>
                    Combat Corruption with<br />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500'>Truth</span>
                </h1>

                <p className='text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-3xl'>
                    BalitAI: Your <span className='text-yellow-400 font-semibold'>AI-powered</span> Philippine Corruption News Agent.
                </p>

                <p className='text-sm sm:text-base text-gray-400 mb-10 italic'>
                    Initiate contextual scan of verified news sources
                </p>

                <button
                    onClick={handleScanClick}
                    disabled={loading}
                    className={`
                        group relative bg-gradient-to-r from-blue-500 to-blue-600 
                        transition-all duration-300 transform 
                        ${loading ? 'opacity-75 cursor-not-allowed scale-95' : 'hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50'} 
                        text-base sm:text-lg md:text-xl 
                        text-white font-bold py-4 px-8 rounded-full
                        border-2 border-blue-400
                        ${loading ? 'animate-pulse' : ''}
                        shadow-lg
                    `}
                >
                    <span className='flex items-center gap-3'>
                        {loading ? 'Scanning...' : 'AI News Scan'}
                        <Search className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:-rotate-12 transition-transform'}`} />
                    </span>
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className='relative z-10 mt-8 p-4 bg-red-900/90 backdrop-blur-sm border border-red-500 rounded-lg max-w-md mx-4 shadow-xl'>
                    <div className='flex items-center gap-2 text-red-300'>
                        <AlertCircle size={20} />
                        <span className='text-base font-semibold'>Error</span>
                    </div>
                    <p className='text-red-200 text-sm mt-2'>{error}</p>
                    <button
                        onClick={onClearError}
                        className='text-yellow-400 text-sm mt-3 hover:underline font-medium'
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    )
}

export default MainSection
