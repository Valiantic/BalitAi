'use client';

import React from 'react';
import { Rss, Filter, FileText, Target, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { useAOS } from '../hooks/useAOS';

const AIAnalysisGuide: React.FC = () => {
    useAOS();

    const steps = [
        {
            icon: Rss,
            title: 'RSS Feed Collection',
            description: 'Continuously monitors trusted Philippine news sources for real-time updates',
            color: 'from-blue-500 to-blue-600',
            bgGlow: 'blue-500/20',
            iconColor: 'text-blue-400'
        },
        {
            icon: Filter,
            title: 'AI Filtering',
            description: 'Advanced algorithms identify corruption-related content with precision',
            color: 'from-purple-500 to-purple-600',
            bgGlow: 'purple-500/20',
            iconColor: 'text-purple-400'
        },
        {
            icon: FileText,
            title: 'Smart Summarization',
            description: 'Key facts extracted and presented in clear, digestible format',
            color: 'from-cyan-500 to-cyan-600',
            bgGlow: 'cyan-500/20',
            iconColor: 'text-cyan-400'
        },
        {
            icon: Target,
            title: 'Corruption Levels',
            description: 'Articles categorized by severity and impact to prioritize critical issues',
            color: 'from-green-500 to-green-600',
            bgGlow: 'green-500/20',
            iconColor: 'text-green-400'
        }
    ];

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-b from-[#1a2942] via-[#0f1f3a] to-[#0a1628] py-20 px-4 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div
                    data-aos="fade-up"
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-300 font-semibold text-sm">Transparency in Action</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
                        📘 How AI Analyzes News
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Understanding our automated process helps you judge credibility responsibly.
                        Here's how BalitAI transforms raw news into actionable intelligence.
                    </p>
                </div>

                {/* Process Flow - Desktop */}
                <div className="hidden lg:block">
                    <div
                        data-aos="fade-up"
                        data-aos-delay="200"
                        className="relative"
                    >
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-cyan-500 to-green-500 transform -translate-y-1/2 opacity-30"></div>

                        {/* Steps Grid */}
                        <div className="grid grid-cols-4 gap-6">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={index}
                                        data-aos="zoom-in"
                                        data-aos-delay={300 + index * 100}
                                        className="relative group"
                                    >
                                        {/* Card */}
                                        <div className={`
                                            relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 
                                            backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 
                                            hover:border-slate-600 transition-all duration-500
                                            hover:scale-105 hover:shadow-2xl hover:shadow-${step.bgGlow}
                                            min-h-[320px] flex flex-col
                                        `}>
                                            {/* Step Number */}
                                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 shadow-lg">
                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                            </div>

                                            {/* Icon */}
                                            <div className={`
                                                w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} 
                                                flex items-center justify-center mb-4 
                                                group-hover:scale-110 transition-transform duration-300
                                                shadow-lg shadow-${step.bgGlow}
                                            `}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>

                                            {/* Title */}
                                            <h3 className={`text-xl font-bold mb-3 ${step.iconColor} group-hover:text-white transition-colors`}>
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                                {step.description}
                                            </p>

                                            {/* Arrow (except last) */}
                                            {index < steps.length - 1 && (
                                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-20">
                                                    <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Process Flow - Mobile/Tablet */}
                <div className="lg:hidden space-y-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={200 + index * 100}
                                className="relative"
                            >
                                {/* Card */}
                                <div className={`
                                    relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 
                                    backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 
                                    hover:border-slate-600 transition-all duration-500
                                    hover:scale-105 hover:shadow-2xl hover:shadow-${step.bgGlow}
                                `}>
                                    {/* Step Number */}
                                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 shadow-lg">
                                        <span className="text-white font-bold text-sm">{index + 1}</span>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`
                                            w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} 
                                            flex items-center justify-center flex-shrink-0
                                            shadow-lg shadow-${step.bgGlow}
                                        `}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow">
                                            <h3 className={`text-lg font-bold mb-2 ${step.iconColor}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow Down (except last) */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center py-3">
                                        <ArrowRight className="w-6 h-6 text-slate-600 rotate-90" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Info Cards */}
                <div
                    data-aos="fade-up"
                    data-aos-delay="600"
                    className="grid md:grid-cols-2 gap-6 mt-16"
                >
                    {/* Transparency Card */}
                    <div className="bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-blue-300 mb-2">Transparency First</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    We believe in open, explainable AI. Every step of our process is designed to be
                                    understandable, allowing you to make informed decisions about the information you consume.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Credibility Card */}
                    <div className="bg-gradient-to-br from-green-900/40 via-green-800/30 to-green-900/40 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-green-300 mb-2">Judge Responsibly</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Our confidence scores help you assess credibility, but critical thinking is key.
                                    Always verify important information and consider multiple perspectives.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisGuide;
