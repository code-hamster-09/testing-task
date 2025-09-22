"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "fmerfner imeodefmes",
    email: "Name2025@mail.ru",
    phone: "+7 (123) 456-__-__",
    address: "Адрес",
  });

  const [errors, setErrors] = useState({
    name: "Неправильное поле ввода",
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-black border-l-4 border-blue-600 pl-3 mb-8">
              Профиль
            </h1>

            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-blue-600">
                  <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-black"
                  >
                    Имя
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`h-12 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg ${errors.name ? "pr-10" : ""}`}
                      readOnly={!isEditing}
                    />
                    {errors.name && (
                      <AlertCircle
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                        size={20}
                      />
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-black"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 h-12 border-gray-300 rounded-lg"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-black"
                  >
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 h-12 border-blue-500 rounded-lg"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-black"
                  >
                    Адрес
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 h-12 border-gray-300 rounded-lg"
                    placeholder="Адрес"
                    readOnly={!isEditing}
                  />
                </div>

                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full md:w-auto h-12 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg px-8"
                >
                  {isEditing ? "Сохранить" : "Редактировать"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
