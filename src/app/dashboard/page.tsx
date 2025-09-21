"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2">Привет, Алим</h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black">Джолдаспаев 👋</h2>
        </div>

        {/* Documents Section */}
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3">Заказы</h3>
            </div>

            {/* Document Carousel */}
            <div className="relative">
              <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-4">
                <div className="flex-shrink-0 w-40 md:w-48">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 h-56 md:h-64">
                    <div className="bg-gray-100 h-24 md:h-32 rounded mb-3 flex items-center justify-center">
                      <div className="text-xs text-gray-500 text-center leading-tight px-2">
                        Счета на оплату для Юр. Лиц
                      </div>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-black mb-3 line-clamp-2">
                      Счета на оплату для Юр. Лиц
                    </p>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm">
                      <Download size={14} className="mr-1 md:mr-2" />
                      Скачать
                    </Button>
                  </div>
                </div>

                <div className="flex-shrink-0 w-40 md:w-48">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 h-56 md:h-64">
                    <div className="bg-gray-100 h-24 md:h-32 rounded mb-3 flex items-center justify-center">
                      <div className="text-xs text-gray-500 text-center leading-tight px-2">Чеки для физ</div>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-black mb-3 line-clamp-2">Чеки для физ</p>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm">
                      <Download size={14} className="mr-1 md:mr-2" />
                      Скачать
                    </Button>
                  </div>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3 mb-4 md:mb-6">
              Профиль
            </h3>

            <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-blue-600 mx-auto md:mx-0 flex-shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-400 rounded-full"></div>
              </div>

              <div className="flex-1 space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-black mb-1">Имя</label>
                  <input
                    type="text"
                    value="Джолдаспаев Алимжан"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    value="name@mail.ru"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-black mb-1">Телефон</label>
                  <input
                    type="tel"
                    value="+7 (123) 456-78-90"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-black mb-1">Адрес</label>
                  <input
                    type="text"
                    placeholder="Телефон"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Broadcast Section */}
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3">
                Трансляция
              </h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm">
                ● Live
              </Button>
            </div>

            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-600 rounded-full mx-auto mb-2 md:mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-400 rounded-full"></div>
                </div>
                <p className="text-xs md:text-sm">Трансляция</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Section */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
              <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3">Платежи</h3>
              <p className="text-xs md:text-sm text-blue-600">Все платежи за последнюю неделю →</p>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-black text-sm md:text-base truncate">Имя</p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">Телефон</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded whitespace-nowrap">
                        Выполнено
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600 text-xs bg-transparent"
                      >
                        Смотреть
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
