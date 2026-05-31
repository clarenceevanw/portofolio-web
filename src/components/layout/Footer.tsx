import { socials } from '@/data/socials'
import { SocialIcon } from '@/components/ui/Icons'

export function Footer() {
  return (
    <footer className="w-full px-12 py-8 flex flex-col md:flex-row justify-between items-center bg-black border-t border-surface-alt z-10 relative">
      <div className="font-mono text-[11px] text-[#555] mb-6 md:mb-0">
        ©2026 CLARENCEEVANW
      </div>
      
      <ul className="flex flex-wrap justify-center gap-6 md:gap-8 font-mono text-[11px]">
        {socials.map((social) => {
          const username = social.platform === 'Email' ? 'clarenceevan0907@gmail.com' : 'clarenceevanw'
          
          return (
            <li key={social.platform} className="text-[#555] hover:text-teal transition-all duration-150 cursor-pointer flex items-center gap-2">
              <a href={social.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 group">
                <SocialIcon name={social.icon} className="w-[18px] h-[18px] group-hover:text-teal transition-colors" />
                <span className="text-border-mid">/</span>
                <span className="text-muted lowercase">{username}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </footer>
  )
}
