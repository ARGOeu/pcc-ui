interface SidebarSectionLabelProps {
  children: React.ReactNode
}

const SidebarSectionLabel = ({ children }: SidebarSectionLabelProps) => (
  <p className="px-4 pt-4 pb-1 text-[0.65rem] font-semibold tracking-widest uppercase text-subtle select-none">
    {children}
  </p>
)

export default SidebarSectionLabel
