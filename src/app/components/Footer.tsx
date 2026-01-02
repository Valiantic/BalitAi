import React from 'react'
import { Sun, Github } from 'lucide-react'

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-gradient-to-b from-[#0a1628] to-[#050d18]">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <Sun className="h-7 w-7 text-yellow-400" />
            <span className="font-bold text-2xl text-white">BalitAI</span>
          </div>

          <div className="flex-1 text-center">
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto">
              Empowering citizens with verified truth.
              <br />
              © {currentYear} BalitAI. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <a
              href="https://github.com/Valiantic/BalitAi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
            >
              <Github className="h-6 w-6" />
              <span className="text-sm font-medium">View on GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-gray-400 text-xs">
            This is a non-profit project for educational purposes. Information is summarized by AI and should be verified via source links.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
