'use client';

import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { policiesData } from '../constants/policiesData'
import { useAOS } from '../hooks/useAOS';
import PolicyModal from './PolicyModal';

const PoliciesSection = () => {
    useAOS();
    const [selectedPolicy, setSelectedPolicy] = useState<typeof policiesData[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePolicyClick = (policy: typeof policiesData[0]) => {
        setSelectedPolicy(policy);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPolicy(null), 300); // Delay to allow animation
    };

    return (
        <section
            data-aos="fade-up"
            className='min-h-screen py-16 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#0f1f3a] to-[#0a1628]'>
            <div className='flex items-center justify-center mb-6 gap-3'>
                <ShieldCheck className='w-10 h-10 md:w-12 md:h-12 text-blue-400' />
                <h2 className='text-3xl sm:text-4xl md:text-5xl text-white font-bold'>7 Key Verification Policies</h2>
            </div>

            <p className='text-sm sm:text-base md:text-lg text-gray-300 text-center mb-12 max-w-3xl'>
                Our ethics protocol for ensuring information integrity
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full'>
                {policiesData.map((policy) => {
                    const { policyId, title, description, icon: Icon } = policy;
                    return (
                        <div
                            key={policyId}
                            data-aos="fade-up"
                            data-aos-delay={policyId * 100}
                            onClick={() => handlePolicyClick(policy)}
                            className='group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 border border-slate-700/50 hover:border-blue-500/50 cursor-pointer'
                        >
                            <div className='flex flex-col items-start mb-4'>
                                <div className='bg-blue-500/10 p-3 rounded-lg mb-4 group-hover:bg-blue-500/20 transition-colors duration-300'>
                                    <Icon className='w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300' />
                                </div>
                                <h3 className='text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300'>
                                    {title}
                                </h3>
                                <p className='text-gray-300 text-sm leading-relaxed'>
                                    {description}
                                </p>
                            </div>

                            <div className='mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between'>
                                <span className='text-xs text-blue-400 font-semibold uppercase tracking-wider'>
                                    Policy #{policyId}
                                </span>
                                <span className='text-xs text-gray-400 group-hover:text-blue-300 transition-colors duration-300'>
                                    Click to learn more →
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Policy Modal */}
            <PolicyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                policy={selectedPolicy}
            />

        </section>
    )
}

export default PoliciesSection
