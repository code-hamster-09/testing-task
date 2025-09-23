"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// types
interface FormData {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  login?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type FormTouched = Record<keyof FormData, boolean>;

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({
    login: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // validation
  const getErrors = (data: FormData): FormErrors => {
    const errs: FormErrors = {};

    if (!data.login.trim()) errs.login = "Введите логин";
    if (!data.email.trim()) errs.email = "Введите email";
    else if (!/^\S+@\S+\.\S+$/.test(data.email))
      errs.email = "Неверный формат email";

    if (data.password.length < 6) errs.password = "Пароль должен быть ≥6 символов";
    else if (!/[A-Z]/.test(data.password))
      errs.password = "Пароль должен содержать заглавную букву";
    else if (!/\d/.test(data.password)) errs.password = "Пароль должен содержать цифру";

    if (data.password !== data.confirmPassword)
      errs.confirmPassword = "Пароли должны совпадать";

    return errs;
  };

  // re-validate on data at every change
  useEffect(() => {
    setErrors(getErrors(formData));
  }, [formData]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // check if all fields are filled and has no errors
  const allFilled = Object.values(formData).every((v) => v.trim() !== "");
  const hasErrors = Object.keys(errors).length > 0;
  const isValid = allFilled && !hasErrors;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // mark all as touched to show errors
    setTouched({
      login: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // final validation
    const currentErrors = getErrors(formData);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // parsing response json
      let data: { errors?: FormErrors } = {};
      try {
        data = await res.json();
      } catch {}

      // reset form or show errors, if success redirect to dashboard, else show error
      if (res.ok) {
        setFormData({ login: "", email: "", password: "", confirmPassword: "" });
        setTouched({ login: false, email: false, password: false, confirmPassword: false });
        window.location.href = "/dashboard";
      } else {
        setErrors(data.errors || { email: "Ошибка регистрации" });
      }
    } catch (err) {
      console.error(err);
      setErrors({ email: "Сетевая ошибка. Попробуйте позже." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-8">ЛОГОТИП</h1>
          <h2 className="text-xl font-medium text-black mb-8">Регистрация</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {( ["login", "email", "password", "confirmPassword"] as (keyof FormData)[] ).map((field) => {
            const isPasswordField = field === "password";
            const isConfirmField = field === "confirmPassword";
            const show = isPasswordField ? showPassword : isConfirmField ? showConfirmPassword : false;

            return (
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
                    autoComplete={
                      isPasswordField || isConfirmField ? "new-password" : undefined
                    }
                    type={isPasswordField || isConfirmField ? (show ? "text" : "password") : "text"}
                    value={formData[field]}
                    onBlur={() => handleBlur(field)}
                    onChange={({ target }) => handleChange(field, target.value)}
                    className={`h-12 rounded-lg pr-10 ${
                      touched[field] && errors[field] ? "border-red-500" : ""
                    }`}
                  />
                  {(isPasswordField || isConfirmField) && (
                    <button
                      type="button"
                      onClick={() =>
                        isPasswordField
                          ? setShowPassword(!showPassword)
                          : setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                  {touched[field] && errors[field] && (
                    <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                  )}
                </div>
                {touched[field] && errors[field] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            );
          })}

          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full h-12 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg"
          >
            {isSubmitting ? "Загрузка..." : "Зарегистрироваться"}
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
  );
}
