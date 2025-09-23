"use client";

import { Header } from "@/components/header";
import { SelectComponent } from "@/components/selectComponent";
import { Button } from "@/components/ui/button";

export default function PaymentsPage() {
  const payments = [
    {
      id: 1,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Не оплачено",
      isPaid: false,
    },
    {
      id: 2,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
    {
      id: 3,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
    {
      id: 4,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
    {
      id: 5,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
    {
      id: 6,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
    {
      id: 7,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
    {
      id: 8,
      accountNumber: "321312321",
      date: "16.03.2025",
      amount: "15,000 тг",
      status: "Оплачено",
      isPaid: true,
    },
  ];

  // const filteredPayments = payments.filter((payment) => {})

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-4 md:p-6 max-w-auto mx-auto mb-20 md:mb-0">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">
            Платежи
          </h1>
          <SelectComponent />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                  Номер счета
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                  Дата
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                  Сумма
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">
                  Действие
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.accountNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`${
                        payment.isPaid ? "text-blue-400" : "text-gray-900"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!payment.isPaid && (
                      <Button
                        size="sm"
                        className="bg-black hover:bg-gray-800 text-white px-4 py-1 rounded-full text-xs"
                      >
                        Оплатить
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4"
            >
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Номер счета
                    </p>
                    <p className="text-sm text-gray-900">
                      {payment.accountNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">Дата</p>
                    <p className="text-sm text-gray-900">{payment.date}</p>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Сумма</p>
                    <p className="text-sm text-gray-900">{payment.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">Статус</p>
                    <p
                      className={`text-sm ${
                        payment.isPaid ? "text-blue-400" : "text-gray-900"
                      }`}
                    >
                      {payment.status}
                    </p>
                  </div>
                </div>

                {!payment.isPaid && (
                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full bg-black hover:bg-gray-800 text-white rounded-full"
                    >
                      Оплатить
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
