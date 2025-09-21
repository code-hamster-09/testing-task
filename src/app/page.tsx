"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-8">ЛОГОТИП</h1>
          <h2 className="text-xl font-medium text-black mb-8">Вход</h2>
        </div>

        <form className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-black">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 h-12 border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-black">
              Пароль
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••••"
                className="h-12 border-gray-300 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
            Вход
          </Button>

          <div className="text-center">
            <span className="text-gray-400">или</span>
          </div>

          <div className="text-center">
            <Link href="/register" className="text-blue-400 hover:text-blue-500 font-medium">
              Регистрация
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
