"use client";

import { Header } from "@/components/header";
import OrdersSkeleton from "@/components/skeletons/ordersSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// types
type Deal = {
  ID: number;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
};

export default function OrdersPage() {
  const [user, setUser] = useState<{ bitrix_contact_id?: number } | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    // reading local user
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        fetchDeals(u?.bitrix_contact_id);
      } catch (e) {
        console.error("invalid user in localStorage", e);
      }
    } else {
      // if no user, load al deals or none
      fetchDeals();
    } 
  }, []);

  const fetchDeals = async (contactId?: number) => {
    setStatus("loading");
    try {
      const url = contactId
        ? `/api/deals?contactId=${contactId}`
        : `/api/deals`;
      const res = await fetch(url);
      const data = await res.json();
      // if data is array, set it, else empty array
      setDeals(Array.isArray(data) ? data : []);
      setStatus("success")
    } catch (e) {
      console.error("Failed to load deals", e);
      setDeals([]);
      setStatus("error")
    }
  };

  // function to repeat a deal
  const handleRepeat = async (deal: Deal) => {
    if (!user?.bitrix_contact_id) return;
    try {
      await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: deal.TITLE,
          contactId: user.bitrix_contact_id,
        }),
      });
      await fetchDeals(user.bitrix_contact_id);
    } catch (e) {
      console.error("Failed to repeat deal", e);
    }
  };

  const router = useRouter()
    useEffect(() => {
        const storedUser = localStorage.getItem("user") || null;
        if (!storedUser) {
          router.push("/");
          return;
        }
      }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4 md:p-6 max-w-auto mx-auto mb-20 md:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">
          Заказы
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {status === "loading" &&
            Array.from({ length: 8 }).map((_, i) => <OrdersSkeleton key={i} />)}
          {deals.length === 0 && status === "success" && <div>Сделок нет</div>}
          {deals.map((order) => (
            <Card
              key={order.ID}
              className="bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm font-medium text-black">
                    {order.STAGE_ID}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-black mb-2">
                  {order.TITLE}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {order.DATE_CREATE}
                </p>

                <Button
                  variant="outline"
                  className="w-full h-10 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium bg-transparent cursor-pointer"
                  onClick={() => handleRepeat(order)}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Повторяем..." : "Повторить заказ"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
