import { FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import type { Service } from '../../types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#45101a] bg-[#130407] transition duration-200 hover:-translate-y-1 hover:border-[#8e0d24]">
      <Link to={`/service/${service.id}`}>
        <div className="aspect-[16/9] overflow-hidden bg-[#23070d]">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/service/${service.id}`}>
          <h3 className="mb-2 line-clamp-2 font-semibold text-white transition hover:text-[#ff7186]">
            {service.title}
          </h3>
        </Link>

        <div className="mb-3 flex items-center gap-1 text-sm text-[#d9aeb6]">
          <FiStar className="fill-current text-[#ffb000]" />

          <span>{service.rating}</span>

          <span className="text-[#805861]">
            ({service.reviewsCount})
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-white">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>

          <Link
            to={`/service/${service.id}`}
            className="rounded-xl bg-[#8e0d24] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e5092f]"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}