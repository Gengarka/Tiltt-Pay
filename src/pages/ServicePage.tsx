import {
  FiArrowLeft,
  FiCheckCircle,
  FiHeart,
  FiShield,
  FiStar,
} from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { Button } from '../components/ui/Button';
import { services } from '../data/services';
import { users } from '../data/users';

export function ServicePage() {
  const { id } = useParams();

  const service = services.find(
    (item) => item.id === Number(id),
  );

  if (!service) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Услуга не найдена
        </h1>

        <p className="mt-2 text-sm text-[#805861]">
          Возможно, она была удалена или больше недоступна.
        </p>

        <Link
          to="/catalog"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#ff7186] hover:text-white"
        >
          <FiArrowLeft />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const seller = users.find(
    (user) => user.id === service.sellerId,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <Link
        to="/catalog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#9e6b74] transition hover:text-white"
      >
        <FiArrowLeft />
        Вернуться в каталог
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-3xl border border-[#45101a] bg-[#100305]">
          <div className="aspect-video overflow-hidden bg-[#23070d]">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#741324] bg-[#26070e] px-3 py-1 text-xs text-[#ff9aaa]">
                Игровая услуга
              </span>

              <span className="flex items-center gap-1 text-sm text-[#d9aeb6]">
                <FiStar className="fill-current text-[#ffb000]" />
                {service.rating}
              </span>

              <span className="text-sm text-[#805861]">
                {service.reviewsCount} отзывов
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {service.title}
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#b88b94]">
              {service.description}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#45101a] bg-[#18050a] p-4">
                <FiCheckCircle className="mb-2 text-[#e5092f]" />

                <div className="text-sm font-semibold">
                  Быстрое выполнение
                </div>

                <div className="mt-1 text-xs text-[#805861]">
                  Исполнитель сразу получит заказ
                </div>
              </div>

              <div className="rounded-xl border border-[#45101a] bg-[#18050a] p-4">
                <FiShield className="mb-2 text-[#e5092f]" />

                <div className="text-sm font-semibold">
                  Безопасная сделка
                </div>

                <div className="mt-1 text-xs text-[#805861]">
                  Деньги защищены до завершения заказа
                </div>
              </div>

              <div className="rounded-xl border border-[#45101a] bg-[#18050a] p-4">
                <FiStar className="mb-2 text-[#e5092f]" />

                <div className="text-sm font-semibold">
                  Высокий рейтинг
                </div>

                <div className="mt-1 text-xs text-[#805861]">
                  Проверенные отзывы покупателей
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-[#45101a] bg-[#100305] p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#805861]">
              Стоимость услуги
            </span>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#45101a] text-[#b88b94] transition hover:border-[#8e0d24] hover:text-[#ff7186]"
              aria-label="Добавить в избранное"
            >
              <FiHeart />
            </button>
          </div>

          <div className="mt-2 text-3xl font-extrabold">
            {service.price.toLocaleString('ru-RU')} ₽
          </div>

          <Button className="mt-6 w-full">
            Купить услугу
          </Button>

          <div className="my-6 h-px bg-[#45101a]" />

          <div className="text-xs uppercase tracking-wider text-[#805861]">
            Исполнитель
          </div>

          {seller && (
            <div className="mt-4 flex items-center gap-3">
              <img
                src={seller.avatar}
                alt=""
                className="h-11 w-11 rounded-full border border-[#741324]"
              />

              <div>
                <div className="font-semibold">
                  {seller.username}
                </div>

                <div className="mt-1 text-xs text-[#805861]">
                  Проверенный продавец
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}