"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Download } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// types
type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export default function DashboardPage() {
  const orders = [
    { id: 1, title: "Счета на оплату для Юр. Лиц" },
    { id: 2, title: "Чеки для физ" },
    { id: 3, title: "Счета на оплату для Юр. Лиц" },
    { id: 4, title: "Чеки для физ" },
    { id: 5, title: "Счета на оплату для Юр. Лиц" },
    { id: 6, title: "Чеки для физ" },
    { id: 7, title: "Счета на оплату для Юр. Лиц" },
    { id: 8, title: "Чеки для физ" },
    { id: 9, title: "Счета на оплату для Юр. Лиц" },
    { id: 10, title: "Чеки для физ" },
  ];
  const payments = [
    {
      id: 1,
      name: "Имя",
      email: "Почта@jourrapide.com",
      status: "pending",
      progress: 96,
    },
    {
      id: 2,
      name: "Gregory Davis A",
      email: "gregorydavis@dayrap.com",
      status: "paid",
      progress: 73,
    },
    {
      id: 3,
      name: "Gregory Davis B",
      email: "gregorydavisb@dayrap.com",
      status: "paid",
      progress: 73,
    },
  ];

  const [user, setUser] = useState<ApiUser | null>(null);
  const [form, setForm] = useState<Partial<ApiUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setError(
        "Нет сохранённого пользователя (localStorage). Войдите, чтобы увидеть профиль."
      );
      setLoading(false);
      return;
    }

    let parsed: unknown = {};
    try {
      parsed = JSON.parse(stored);
    } catch {
      setError("Ошибка парсинга localStorage.user");
      setLoading(false);
      return;
    }

    const id =
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in (parsed as ApiUser)
        ? Number((parsed as ApiUser).id)
        : NaN;
    if (!id || Number.isNaN(id)) {
      setError("В localStorage.user нет корректного id");
      setLoading(false);
      return;
    }

    fetch(`/api/profile?id=${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json?.error ?? `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setUser(json.data);
        setForm(json.data);
      })
      .catch((e) => {
        console.error("Ошибка загрузки профиля:", e);
        setError(String(e?.message ?? e));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || null;
    if (!storedUser) {
      router.push("/");
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      <div className="p-4 md:p-6 max-w-auto mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-2">
            Привет, {user?.name ?? "User"} 👋
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 ">
          {/* Documents Section */}
          <Card className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3">
                  Заказы
                </h3>
              </div>

              {/* Document Carousel */}
              <div className="w-full">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1.15}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 16 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                  }}
                  navigation
                  pagination={{ clickable: true }}
                  className="pb-6"
                >
                  {orders.map((order) => (
                    <SwiperSlide key={order.id} className="!w-auto">
                      {" "}
                      {/* !w-auto чтобы не перекрывать Swiper */}
                      <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-3 md:p-4 h-56 md:h-64 w-56 md:w-64">
                        <div className="bg-gray-100 h-24 md:h-32 rounded mb-3 flex items-center justify-center">
                          <div className="text-xs text-gray-500 text-center leading-tight px-2">
                            {order.title}
                          </div>
                        </div>
                        <p className="text-xs md:text-sm font-medium text-black mb-3 line-clamp-2">
                          {order.title}
                        </p>
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm mt-auto cursor-pointer"
                        >
                          <Download size={14} className="mr-1 md:mr-2" />
                          Скачать
                        </Button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </CardContent>
          </Card>

          {/* Profile Section */}
          <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h1 className="text-xl font-medium text-black border-l-4 border-blue-600 pl-3 mb-4">
                Профиль
              </h1>

              {/* Форма */}
              {loading ? (
                <div>Загрузка</div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                  {/* Аватар */}
                  <div className="flex-shrink-0 mb-6 md:mb-0">
                    <div className="w-32 h-32 lg:w-16 lg:h-16 bg-gray-200 rounded-full flex items-center justify-center border-4 lg:border-3 border-blue-600">
                      <div className="lg:w-12 lg:h-12 w-16 h-16 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-black"
                      >
                        Имя
                      </Label>
                      <Input
                        id="login"
                        type="text"
                        value={form?.name ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...(p ?? {}),
                            name: e.target.value,
                          }))
                        }
                        className="mt-1 h-10 border-gray-300 rounded-lg"
                        readOnly
                      />
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
                        value={form?.email ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...(p ?? {}),
                            email: e.target.value,
                          }))
                        }
                        className="mt-1 h-10 border-gray-300 rounded-lg"
                        readOnly
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
                        value={form?.phone ?? ""}
                        placeholder="+7 (999) 999-99-99"
                        onChange={(e) =>
                          setForm((p) => ({
                            ...(p ?? {}),
                            phone: e.target.value,
                          }))
                        }
                        className="mt-1 h-10 border-gray-300 rounded-lg"
                        readOnly
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
                        value={form?.address ?? ""}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...(p ?? {}),
                            address: e.target.value,
                          }))
                        }
                        className="mt-1 h-10 border-gray-300 rounded-lg"
                        placeholder="Адрес"
                        readOnly
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-6 ">
          {/* Broadcast Section */}
          <Card className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3">
                  Трансляция
                </h3>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm"
                >
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
          <Card className="lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-4 md:p-6">
              {/* Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center mb-6">
                <h3 className="text-base md:text-lg font-semibold text-black border-l-4 border-blue-600 pl-3">
                  Платежи
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 justify-start sm:justify-end">
                  <span>Все платежи за последнюю неделю</span>
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid grid-cols-18 gap-4 pb-3 border-b border-gray-300 text-sm text-gray-500 font-medium">
                <div className="col-span-6">Employee</div>
                <div className="col-span-4">Статус</div>
                <div className="col-span-6">Выполнено</div>
                <div className="col-span-2">Действие</div>
              </div>

              {/* Payment Rows */}
              <div className="mt-4 grid gap-4">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-2 md:grid-cols-18 gap-4 items-center py-3 border-b border-gray-300 md:border-gray-200 last:border-b-0"
                  >
                    {/* User Info */}
                    <div className="flex items-center space-x-3 md:col-span-6">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-black text-sm">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500">{p.email}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex md:justify-start md:col-span-4 font-medium justify-end sm:m-0 mb-auto">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          p.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-1 ${
                            p.status === "paid" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        {p.status === "paid" ? "Оплачено" : "Не оплачено"}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center space-x-2 md:col-span-6">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[3rem]">
                        {p.progress}%
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex md:justify-start md:col-span-2 justify-end">
                      <Button
                        size="sm"
                        className="bg-transparent hover:text-blue-700 text-blue-500 text-sm cursor-pointer m-0 p-0"
                      >
                        Смотреть
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
