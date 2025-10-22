import type React from "react"
import { FileText, Tag, Settings, LogOut } from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  return (
    <aside
      className={`${isOpen ? "w-64" : "w-0"} bg-card border-r border-border transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6 space-y-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">Blog Admin</div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem icon={<FileText className="w-5 h-5" />} label="Posts" href="#posts" />
          <NavItem icon={<Tag className="w-5 h-5" />} label="Tags" href="#tags" />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" href="#settings" />
        </nav>

        {/* Logout */}
        <div className="pt-8 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition"
    >
      {icon}
      <span>{label}</span>
    </a>
  )
}
