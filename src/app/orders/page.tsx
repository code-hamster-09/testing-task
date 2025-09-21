"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const orders = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    status: "Статус",
    service: "Детали услуги",
    date: "Дата заказа",
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">Заказы</h1>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-black">{order.status}</span>
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">{order.service}</h3>
                <p className="text-sm text-gray-600 mb-6">{order.date}</p>

                <Button
                  variant="outline"
                  className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium bg-transparent"
                >
                  Повторить заказ
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Stack Layout */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-black">{order.status}</span>
                </div>

                <h3 className="text-base font-semibold text-black mb-2">{order.service}</h3>
                <p className="text-sm text-gray-600 mb-4">{order.date}</p>

                <Button
                  variant="outline"
                  className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium bg-transparent"
                >
                  Повторить заказ
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
