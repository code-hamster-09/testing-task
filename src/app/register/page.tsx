"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface FormData {
  login: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  login?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const errs: FormErrors = {}

    if (!formData.login) errs.login = "Введите логин"
    if (!formData.email) errs.email = "Введите email"
    if (formData.password.length < 6) errs.password = "Пароль должен быть ≥6 символов"
    if (!/[A-Z]/.test(formData.password)) errs.password = "Пароль должен содержать заглавную букву"
    if (!/\d/.test(formData.password)) errs.password = "Пароль должен содержать цифру"
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Пароли должны совпадать"

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data: { errors?: FormErrors } = await res.json()

    if (res.ok) {
      window.location.href = "/dashboard"
    } else {
      setErrors(data.errors || { email: "Ошибка регистрации" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-8">ЛОГОТИП</h1>
          <h2 className="text-xl font-medium text-black mb-8">Регистрация</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {(["login", "email", "password", "confirmPassword"] as (keyof FormData)[]).map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="text-sm font-medium text-black">
                {field === "confirmPassword"
                  ? "Повторите пароль"
                  : field === "password"
                  ? "Пароль"
                  : field === "email"
                  ? "Email"
                  : "Логин"}
              </Label>
              <div className="relative mt-1">
                <Input
                  id={field}
                  type={field.includes("password") ? "password" : "text"}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className={`h-12 rounded-lg pr-10 ${errors[field] ? "border-red-500" : ""}`}
                />
                {errors[field] && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
              </div>
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <Button type="submit" className="w-full h-12 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg">
            Зарегистрироваться
          </Button>

          <div className="text-center mt-2">
            <span className="text-gray-400">или</span>
            <div>
              <Link href="/" className="text-blue-400 hover:text-blue-500 font-medium">
                Вход
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
