export function SkillTag({ label }: { label: string }) {
  return (
    <span className="skill-tag opacity-0 px-3 py-1 border border-[#333] text-[#aaa] font-mono text-[11px] uppercase transition-colors hover:border-teal hover:text-white rounded-none">
      [{label}]
    </span>
  )
}
