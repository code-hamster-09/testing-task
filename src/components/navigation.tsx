"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User, BarChart3, CreditCard, Radio, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { name: "Профиль", href: "/profile", icon: User },
  { name: "Заказы", href: "/orders", icon: BarChart3 },
  { name: "Платежи", href: "/payments", icon: CreditCard },
  { name: "Трансляция", href: "/broadcast", icon: Radio },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-lg font-bold text-black">
            ЛОГОТИП
          </Link>

          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-bold text-black">
            ЛОГОТИП
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      )}
                    >
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation - Alternative */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center space-y-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors min-w-0",
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900",
                )}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="md:hidden h-20"></div>
    </>
  )
}
