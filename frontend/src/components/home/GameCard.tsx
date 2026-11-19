import { Link } from 'react-router-dom';

interface GameCardProps {
  game: any; 
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/catalog?game=${encodeURIComponent(game.name)}`}
      className="group block overflow-hidden rounded-2xl border border-[#45101a] bg-[#100305] transition hover:border-[#e5092f]"
    >
      <div className="aspect-[16/9] overflow-hidden bg-[#23070d]">
        {game.image ? (
          <img
            src={game.image}
            alt={game.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
           <div className="flex h-full items-center justify-center text-[#805861]">Нет фото</div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1 text-xs text-[#a96d78]">
          {game.category || 'Игра'}
        </div>
        <h3 className="font-semibold text-white">
          {game.name}
        </h3>
      </div>
    </Link>
  );
}