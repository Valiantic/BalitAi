import { Shield, Lock, Bot, MessageCircle, Ban, Mail, Wifi } from 'lucide-react';

export const policiesData = [
    {
        policyId: 1,
        title: "Security Vigilance and Reporting",
        description: "Stay alert to AI-generated corruption-related media. Recognize manipulated or misleading content and report suspicious materials immediately.",
        icon: Shield,
        imagePath: "/images/security-vigilance-and-reporting.jpg",
        keyMessage: "Always verify suspicious AI-generated content and report anything misleading.",
        whyItMatters: "Helps prevent misinformation, protects users from deception, and maintains a trusty online environment.",
        callToAction: "Think before you share, verify first then report any questionable AI content."
    },
    {
        policyId: 2,
        title: "Data Privacy and Confidentiality",
        description: "Protect personal and sensitive information when interacting with AI tools and social media. Do not share identifiable data.",
        icon: Lock,
        imagePath: "/images/data-privacy-and-confidentiality.png",
        keyMessage: "Protect personal information and never share sensitive data online.",
        whyItMatters: "Keep your identity, privacy, and digital safety protected from misuse and exploitation.",
        callToAction: "Secure your data, review, remove and safeguard personal details before posting anything."
    },
    {
        policyId: 3,
        title: "AI and Automated Tools Usage",
        description: "Any content created or modified using AI tools must be clearly labeled or disclosed. Be transparent when using AI.",
        icon: Bot,
        imagePath: "/images/au-and-automated-tools-usage.png",
        keyMessage: "Always label and disclose when content is created or edited with AI.",
        whyItMatters: "Promotes transparency, prevents confusion, and builds trust in what people see online.",
        callToAction: "Add an \"AI-Generated\" or \"AI-Assisted\" tag to all AI-made content before sharing."
    },
    {
        policyId: 4,
        title: "Respectful Communication Online",
        description: "Communicate respectfully and responsibly online. Avoid offensive language, harassment, hate speech, and harmful comments.",
        icon: MessageCircle,
        imagePath: "/images/respectful-communication-online.png",
        keyMessage: "Communicate respectfully and avoid harmful, offensive, or hostile online behavior.",
        whyItMatters: "Encourages a safe digital environment and prevents conflict, harassment, and misinformation-driven harm.",
        callToAction: "Think before you type: choose respectful, responsible, and professional communication."
    },
    {
        policyId: 5,
        title: "Prohibited IT Practices",
        description: "Prohibited activities include hacking, accessing systems without permission, sharing viruses, and using AI tools for illegal actions.",
        icon: Ban,
        imagePath: "/images/prohibited-it-practices.png",
        keyMessage: "Do not install or engage with suspicious software, links, or downloads.",
        whyItMatters: "Prevents malware attacks that can steal data, damage devices, or compromise accounts.",
        callToAction: "Stay secure, avoid unknown links and only download software from trusted sources."
    },
    {
        policyId: 6,
        title: "Email and Communication Standards",
        description: "Keep emails professional, secure, and free from risky or inappropriate content.",
        icon: Mail,
        imagePath: "/images/email-and-communication-standards.png",
        keyMessage: "Keep emails professional, secure, and free from risky or inappropriate content.",
        whyItMatters: "Protects confidential information and prevents phishing, mistakes, or communication-based security breaches.",
        callToAction: "Double-check recipients, attachments, and message content before clicking send."
    },
    {
        policyId: 7,
        title: "Remote Work / Remote Access Security",
        description: "Secure your device and network when accessing systems remotely to prevent unauthorized access.",
        icon: Wifi,
        imagePath: "/images/remote-work-remote-access-security.png",
        keyMessage: "Secure your device and network when accessing systems remotely.",
        whyItMatters: "Prevents unauthorized access, data leaks, and system vulnerabilities during remote work.",
        callToAction: "Use secure connections, log out when not in use, and report unusual system activity immediately."
    }
];

