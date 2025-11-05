import type React from "react"
import { FileText, Users, Tag, Settings, LogOut } from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export default function AdminSidebar({ isOpen, activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  return (
    <aside
      className={`${isOpen ? "w-64" : "w-0"} bg-card border-r border-border transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6 space-y-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">Blog Admin</div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem 
            icon={<FileText className="w-5 h-5" />} 
            label="Posts" 
            active={activeTab === 'posts'}
            onClick={() => onTabChange('posts')}
          />
          <NavItem 
            icon={<Users className="w-5 h-5" />} 
            label="Users" 
            active={activeTab === 'users'}
            onClick={() => onTabChange('users')}
          />
          <NavItem 
            icon={<Tag className="w-5 h-5" />} 
            label="Tags" 
            active={activeTab === 'tags'}
            onClick={() => onTabChange('tags')}
          />
          <NavItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={() => onTabChange('settings')}
          />
        </nav>

        {/* Logout */}
        <div className="pt-8 border-t border-border">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ 
  icon, 
  label, 
  active,
  onClick 
}: { 
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
