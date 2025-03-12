'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  AlertTriangle, 
  UserCheck, 
  TrendingDown, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Risks',
    href: '/risks',
    icon: AlertTriangle,
  },
  {
    name: 'Retention',
    href: '/retention',
    icon: UserCheck,
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: TrendingDown,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true) // Default to collapsed
  
  // Initialize state from localStorage when component mounts (client-side only)
  useEffect(() => {
    // Get saved state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    
    // Only update if we have a saved state
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
  }, [])
  
  // Update localStorage when state changes
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  // Handle logout function
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className={cn(
      "relative h-full border-r bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-4 z-10 rounded-full border shadow-md bg-white"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="flex h-16 items-center px-4">
        {!isCollapsed && <div className="text-xl font-bold text-primary">Glynac</div>}
        {isCollapsed && <Menu className="mx-auto h-5 w-5 text-primary" />}
      </div>

      <div className="flex flex-col space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 transition-colors hover:text-primary",
              pathname === item.href && "bg-primary-foreground text-primary",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-2 py-4">
        <Button 
          variant="ghost" 
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-gray-500 transition-colors hover:text-red-600",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}