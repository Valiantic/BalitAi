'use client';

import React from 'react';
import { AlertTriangle, BookOpen, Users, CheckCircle2, XCircle } from 'lucide-react';
import { useAOS } from '../hooks/useAOS';

const AILimitationsNotice: React.FC = () => {
    useAOS();

    return (
        <div className="relative w-full bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#1a2942] py-20 px-4 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-10 left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Main Notice Card */}
                <div
                    data-aos="fade-up"
                    className="relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/10 overflow-hidden"
                >
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tr-full"></div>

                    {/* Icon Header */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/30 blur-xl rounded-full animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <AlertTriangle className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
                            🧪 AI Limitations Notice
                        </span>
                    </h2>

                    {/* Main Message */}
                    <div
                        data-aos="zoom-in"
                        data-aos-delay="200"
                        className="bg-gradient-to-r from-yellow-900/40 via-orange-900/40 to-yellow-900/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-yellow-500/30 mb-8"
                    >
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-yellow-100 leading-relaxed">
                            &quot;BalitAI does not replace investigative journalism.&quot;
                        </p>
                    </div>

                    {/* Supporting Points Grid */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="300"
                        className="grid md:grid-cols-2 gap-6 mb-8"
                    >
                        {/* What AI Can Do */}
                        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-green-300">What AI Can Do</h3>
                            </div>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Monitor multiple news sources 24/7</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Identify patterns and trends quickly</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Summarize complex information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Surface relevant corruption-related news</span>
                                </li>
                            </ul>
                        </div>

                        {/* What AI Cannot Do */}
                        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-red-300">What AI Cannot Do</h3>
                            </div>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Conduct original investigations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Verify sources through interviews</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Understand nuanced context fully</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-1">•</span>
                                    <span>Replace human judgment and ethics</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Call to Action Cards */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="400"
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {/* Independent Verification */}
                        <div className="group bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-blue-300 mb-2">Always Verify</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Cross-check important information with original sources and multiple outlets before drawing conclusions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Support Journalism */}
                        <div className="group bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-purple-300 mb-2">Support Real Journalism</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        AI is a tool to assist, not replace. Support investigative journalists who do the critical work.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Disclaimer */}
                    <div
                        data-aos="fade-up"
                        data-aos-delay="500"
                        className="mt-8 pt-6 border-t border-slate-700/50"
                    >
                        <p className="text-center text-gray-400 text-sm leading-relaxed">
                            <span className="font-semibold text-yellow-400">Remember:</span> BalitAI is designed to help you stay informed,
                            but critical thinking, independent verification, and support for professional journalism remain essential
                            for a healthy democracy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AILimitationsNotice;
