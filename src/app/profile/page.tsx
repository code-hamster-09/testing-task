"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// types
type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [form, setForm] = useState<Partial<ApiUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // reading local user
    const stored = localStorage.getItem("user");
    if (!stored) {
      setError(
        "Нет сохранённого пользователя (localStorage). Войдите, чтобы увидеть профиль."
      );
      setLoading(false);
      return;
    }

    // parse user
    let parsed: unknown = {};
    try {
      parsed = JSON.parse(stored);
    } catch {
      setError("Ошибка парсинга localStorage.user");
      setLoading(false);
      return;
    }

    // get id
    const id =
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in (parsed as ApiUser)
        ? Number((parsed as ApiUser).id)
        : NaN;
    // if no id, error
    if (!id || Number.isNaN(id)) {
      setError("В localStorage.user нет корректного id");
      setLoading(false);
      return;
    }

    // fetching profile
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

  // save changes
  const save = async () => {
    if (!form?.id) return;
    try {
      // fetch put api/profile
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // if res not ok, error
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      // else, set user
      const j = await res.json();
      setUser(j.data);
      setForm(j.data);
      setIsEditing(false);
    } catch (e) {
      console.error("Ошибка сохранения:", e);
      setError(String(e));
    }
  };

  const router = useRouter();
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || null;
    if (!storedUser) {
      router.push("/");
      return;
    }
  }, [router]);

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (!user)
    return (
      <div className="p-6">
        Пользователь не найден.{" "}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4 md:p-6 max-w-4xl mx-auto mb-20 md:mb-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-black border-l-4 border-blue-600 pl-3 mb-8">
              Профиль
            </h1>

            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* Аватар */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-blue-600">
                  <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              {/* Форма */}
              <div className="flex-1 space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-black"
                  >
                    Имя
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={form?.name ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...(p ?? {}), name: e.target.value }))
                    }
                    className="mt-1 h-12 border-gray-300 rounded-lg"
                    readOnly={!isEditing}
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
                      setForm((p) => ({ ...(p ?? {}), email: e.target.value }))
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
                    value={form?.phone ?? ""}
                    placeholder="+7 (999) 999-99-99"
                    onChange={(e) =>
                      setForm((p) => ({ ...(p ?? {}), phone: e.target.value }))
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
                    value={form?.address ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...(p ?? {}),
                        address: e.target.value,
                      }))
                    }
                    className="mt-1 h-12 border-gray-300 rounded-lg"
                    placeholder="Адрес"
                    readOnly={!isEditing}
                  />
                </div>

                <Button
                  onClick={() => (isEditing ? save() : setIsEditing(true))}
                  className="w-full md:w-auto h-12 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg px-8 cursor-pointer"
                >
                  {isEditing ? "Сохранить" : "Редактировать"}
                </Button>

                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
