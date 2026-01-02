'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { X, AlertCircle, Lightbulb, Target } from 'lucide-react';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    policy: {
        policyId: number;
        title: string;
        description: string;
        imagePath: string;
        keyMessage: string;
        whyItMatters: string;
        callToAction: string;
    } | null;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policy }) => {
    const modalContainerRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Track when component is mounted (client-side only)
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Scroll the modal container to top when it opens (not the page)
    useEffect(() => {
        if (isOpen && modalContainerRef.current) {
            // Scroll the modal's own container to top, not the page
            modalContainerRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    if (!isOpen || !policy || !mounted) return null;

    const modalContent = (
        <>
            {/* Fixed Backdrop Overlay */}
            <div
                className="fixed inset-0 z-50 bg-gradient-to-br from-black/80 via-slate-900/90 to-black/80 backdrop-blur-md animate-fadeIn"
                onClick={onClose}
            />

            {/* Fixed Modal Container - Always Centered */}
            <div
                ref={modalContainerRef}
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={onClose}
            >
                <div className="flex min-h-full items-start justify-center p-4 py-8">
                    <div
                        className="relative bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full border border-slate-700/50 shadow-2xl shadow-blue-500/10 animate-slideUp my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-20 p-3 bg-slate-800/80 hover:bg-red-500/80 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-lg group"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6 text-white group-hover:text-white" />
                        </button>

                        {/* Modal Content */}
                        <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                            {/* Hero Image Section */}
                            <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-t-3xl">
                                <Image
                                    src={policy.imagePath}
                                    alt={policy.title}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                                {/* Gradient Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>

                                {/* Policy Number Badge */}
                                <div className="absolute top-6 left-6 px-4 py-2 bg-blue-500/90 backdrop-blur-sm rounded-full shadow-lg">
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                                        Policy #{policy.policyId}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 md:p-10">
                                {/* Header */}
                                <div className="mb-8">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mb-4 leading-tight">
                                        {policy.title}
                                    </h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {policy.description}
                                    </p>
                                </div>

                                {/* Information Cards */}
                                <div className="space-y-6">
                                    {/* Key Message */}
                                    <div className="group relative p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-2xl hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors duration-300">
                                                <AlertCircle className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                                                    Key Message
                                                </h3>
                                                <p className="text-gray-200 leading-relaxed text-base">
                                                    {policy.keyMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Why It Matters */}
                                    <div className="group relative p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-2xl hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-yellow-500/20 rounded-xl group-hover:bg-yellow-500/30 transition-colors duration-300">
                                                <Lightbulb className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                                    Why It Matters
                                                </h3>
                                                <p className="text-gray-200 leading-relaxed text-base">
                                                    {policy.whyItMatters}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call to Action */}
                                    <div className="group relative p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-2xl hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors duration-300">
                                                <Target className="w-6 h-6 text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                                                    Call to Action
                                                </h3>
                                                <p className="text-gray-200 leading-relaxed text-base font-medium">
                                                    {policy.callToAction}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button at Bottom */}
                                <div className="mt-10 flex justify-center">
                                    <button
                                        onClick={onClose}
                                        className="group px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 flex items-center gap-3"
                                    >
                                        <span>Got it, thanks!</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    // Use portal to render modal directly to body, avoiding AOS transform issues
    return ReactDOM.createPortal(modalContent, document.body);
};

export default PolicyModal;
