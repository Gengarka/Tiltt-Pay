import type { Game } from '../../types';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#45101a] bg-[#130407] transition duration-200 hover:-translate-y-1 hover:border-[#8e0d24]">
      <div className="aspect-[16/9] overflow-hidden bg-[#23070d]">
        <img
          src={game.image}
          alt={game.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-1 text-xs text-[#a96d78]">
          {game.category}
        </div>

        <h3 className="font-semibold text-white">
          {game.name}
        </h3>
      </div>
    </article>
  );
}