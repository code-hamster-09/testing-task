"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDeals, createDeal } from "@/lib/bitrix";

interface Deal {
  ID: number;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
}

export default function OrdersPage() {
  const [mockUser, setMockUser] = useState<{ bitrix_contact_id?: number } | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setMockUser(user);

      if (user.bitrix_contact_id) {
        (async () => {
          const list = await getDeals(user.bitrix_contact_id);
          setDeals(list);
        })();
      }
    }
  }, []);

  const handleRepeat = async (deal: Deal) => {
    if (!mockUser?.bitrix_contact_id) return;
    setLoading(true);
    await createDeal(deal.TITLE, mockUser.bitrix_contact_id);
    const updated = await getDeals(mockUser.bitrix_contact_id);
    setDeals(updated);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-4 md:p-6 max-w-auto mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">
          Заказы
        </h1>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((order) => (
            <Card key={order.ID} className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-black">{order.STAGE_ID}</span>
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">{order.TITLE}</h3>
                <p className="text-sm text-gray-600 mb-6">{order.DATE_CREATE}</p>

                <Button
                  variant="outline"
                  className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium bg-transparent"
                  onClick={() => handleRepeat(order)}
                  disabled={loading}
                >
                  {loading ? "Повторяем..." : "Повторить заказ"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Stack Layout */}
        <div className="md:hidden space-y-4">
          {deals.map((order) => (
            <Card key={order.ID} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-black">{order.STAGE_ID}</span>
                </div>

                <h3 className="text-base font-semibold text-black mb-2">{order.TITLE}</h3>
                <p className="text-sm text-gray-600 mb-4">{order.DATE_CREATE}</p>

                <Button
                  variant="outline"
                  className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium bg-transparent"
                  onClick={() => handleRepeat(order)}
                  disabled={loading}
                >
                  {loading ? "Повторяем..." : "Повторить заказ"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
