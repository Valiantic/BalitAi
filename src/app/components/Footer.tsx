import React from 'react'
import { Sun, Github } from 'lucide-react'

const Footer = () => {
 
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white bg-card">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Sun className="h-6 w-6 text-primary text-yellow-400" />
            <span className="font-bold text-white">BalitAI</span>
          </div>
          <p className="text-white text-center text-sm text-muted-foreground md:text-left">
            This is a non-profit project for educational purposes.
            <br />
            Information is summarized by AI and should be verified via source links.
          </p>
          <div className="flex flex-col items-end justify-end gap-4 text-right">
            <p className="text-white font-leading">Developed and Designed by Steven Madali</p>
            <p className="text-white font-leading">© {currentYear} BalitAI. All rights reserved.</p>
          </div>
          <a
              href="https://github.com/Valiantic/BalitAi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-yellow-500 text-muted-foreground hover:text-foreground" />
            </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
