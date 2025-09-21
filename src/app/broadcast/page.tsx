"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BroadcastPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">Трансляция</h1>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-black">Прямая трансляция</h2>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                ● Live
              </Button>
            </div>

            <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-white text-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                </div>
                <p className="text-sm">Трансляция активна</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Начать трансляцию</Button>
              <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 bg-transparent">
                Остановить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
