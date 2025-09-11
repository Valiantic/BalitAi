import React, { useState, useEffect } from 'react';
import { LoadingModalProps } from '../../types/modal';
import Logo from '../../../../public/images/logo.png';
import Image from 'next/image';

const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isOpen, 
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const loadingMessages = [
    "• Searching trusted news sources",
    "• Analyzing content with AI", 
    "• Filtering corruption-related news"
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % loadingMessages.length
      );
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isOpen, loadingMessages.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-900 border border-yellow-500 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {/* Video Player */}
          <div className="mb-6 rounded-lg overflow-hidden border-2 border-yellow-500">
            <video
              autoPlay
              loop
              muted
              className="w-64 h-36 object-cover"
              playsInline
            >
              <source src="/videos/loading.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

         <div className="flex justify-center items-center flex-col">
            <Image
                src={Logo}
                alt="BalitAI Logo"
                width={100}
                height={100}
                className="mb-4 animate-pulse"
            />

            {/* Loading Text */}
            <h3 className="text-xl font-bold text-white mb-4">
                BalitAI is Working
            </h3>

            {/* Cycling Loading Messages */}
            <div className="h-6 mb-4">
              <p className="text-yellow-500 text-sm transition-all duration-500 ease-in-out transform">
                {loadingMessages[currentMessageIndex]}
              </p>
            </div>

            {/* Loading Animation */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
