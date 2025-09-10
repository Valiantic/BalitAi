'use client';

import React from 'react'
import Image from 'next/image'
import Logo from '../../../public/images/logo.png'
import { Search, AlertCircle } from 'lucide-react'
import LoadingModal from './modals/LoadingModal'
import { MainSectionProps } from '../types/mainsection';

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

    return (
        <div className='relative flex flex-col justify-center items-center min-h-screen overflow-hidden'>
            {/* Root-like Circuit Background */}
            <div className='absolute inset-0 pointer-events-none'>
                <div className='circuit-roots'></div>
            </div>
            
            <div className='relative z-10'>
                <Image
                src={Logo}
                alt='BalitAI Logo'
                width={350}
                height={320}
                className='w-55 h-52 sm:w-68 sm:h-68 md:w-[350px] md:h-[320px]'
                />
            </div>

            <div className='relative z-10 flex flex-col items-center justify-center mt-2 gap-4'>
                <h1 className='text-4xl sm:text-4xl md:text-7xl font-bold text-white'>BalitAI</h1>
                <p className='text-xs sm:text-xs md:text-lg text-white font-poppins underline underline-offset-8 decoration-yellow-500'>
                    Your <span className='text-yellow-500 font-bold'>AI-powered</span> Philippine Corruption News Agent
                </p>
            </div>

            <div className='relative z-10 flex align-items justify-center mt-8'>
                <button 
                    onClick={handleScanClick}
                    disabled={loading}
                    className={`
                        bg-blue-500 transition-all duration-300 transform 
                        ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-110 hover:bg-blue-700'} 
                        border border-2 border-yellow-500 text-xs sm:text-base md:text-2xl 
                        text-white font-bold py-2 px-4 rounded-full
                        ${loading ? 'animate-pulse' : ''}
                    `}
                >
                    {loading ? 'Scanning...' : 'AI News Scan'}
                    <Search className={`inline-block ml-2 text-bold text-yellow-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className='relative z-10 mt-4 p-4 bg-red-900 bg-opacity-80 border border-red-500 rounded-lg max-w-md mx-4'>
                    <div className='flex items-center gap-2 text-red-300'>
                        <AlertCircle size={16} />
                        <span className='text-sm font-semibold'>Error</span>
                    </div>
                    <p className='text-red-200 text-xs mt-1'>{error}</p>
                    <button 
                        onClick={onClearError}
                        className='text-yellow-400 text-xs mt-2 hover:underline'
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Loading Modal */}
            <LoadingModal 
                isOpen={loading} 
                message="Scanning trusted Philippine news sources for corruption-related content..."
            />
        </div>
    )
}

export default MainSection
