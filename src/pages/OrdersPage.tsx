import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiXCircle,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { orders } from '../data/orders';

const statusInfo = {
  completed: {
    label: 'Завершён',
    icon: FiCheckCircle,
    className:
      'border-[#1d6338] bg-[#0b2818] text-[#70d99a]',
  },
  processing: {
    label: 'В процессе',
    icon: FiClock,
    className:
      'border-[#72591c] bg-[#2a2109] text-[#e8c96b]',
  },
  cancelled: {
    label: 'Отменён',
    icon: FiXCircle,
    className:
      'border-[#7d1728] bg-[#2a0710] text-[#ff8798]',
  },
};

export default function OrdersPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <Link
        to="/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] transition hover:text-white"
      >
        <FiArrowLeft />
        Личный кабинет
      </Link>

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#e5092f]">
          Личный кабинет
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          История заказов
        </h1>

        <p className="mt-2 text-sm text-[#805861]">
          Здесь собраны все твои заказы.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusInfo[order.status];
          const StatusIcon = status.icon;

          return (
            <article
              key={order.id}
              className="rounded-2xl border border-[#45101a] bg-[#100305] p-5 transition hover:border-[#741324] sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#26070e] text-[#e5092f]">
                    <FiPackage />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-bold">
                        {order.title}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon />
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#805861]">
                      <span>Заказ #{order.id}</span>
                      <span>{order.game}</span>
                      <span>{order.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-5 border-t border-[#45101a] pt-4 lg:border-0 lg:pt-0">
                  <div>
                    <div className="text-xs text-[#805861]">
                      Сумма
                    </div>

                    <div className="mt-1 text-lg font-bold">
                      {order.price.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <Link
                    to={`/service/${order.serviceId}`}
                    className="rounded-xl border border-[#5c101e] px-4 py-2.5 text-sm font-medium text-[#ff7186] transition hover:bg-[#26070e] hover:text-white"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="rounded-3xl border border-[#45101a] bg-[#100305] px-5 py-16 text-center">
          <FiPackage className="mx-auto text-3xl text-[#8e0d24]" />

          <h2 className="mt-4 text-lg font-bold">
            Заказов пока нет
          </h2>

          <p className="mt-2 text-sm text-[#805861]">
            После первой покупки она появится здесь.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-[#8e0d24] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e5092f]"
          >
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  );
}