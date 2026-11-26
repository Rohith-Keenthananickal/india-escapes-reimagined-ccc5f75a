import type { CSSProperties } from 'react';
import { Heart, MapPin, Clock, Star, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategory } from '../data/experienceContent';
import { formatINR } from '../lib/motion';
import type { NormalizedExperience } from '../types/experiences.types';
import { SmartImage } from './SmartImage';

interface ExperienceTileProps {
  experience: NormalizedExperience;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  onOpen: (experience: NormalizedExperience) => void;
  className?: string;
}

export const ExperienceTile = ({ experience, isLiked, onToggleLike, onOpen, className }: ExperienceTileProps) => {
  const category = getCategory(experience.categorySlug);

  return (
    <article
      data-flip-id={`exp-${experience.id}`}
      style={{ '--accent': category.accent } as CSSProperties}
      className={cn(
        'explore-tile group relative overflow-hidden rounded-[1.6rem] bg-exp-night shadow-[0_20px_40px_-25px_rgba(13,15,30,.6)] ring-0 ring-[var(--accent)] transition-[box-shadow] duration-500 hover:shadow-[0_30px_60px_-20px_var(--accent)] hover:ring-2',
        className
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(experience)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-exp-marigold"
        aria-label={`View ${experience.title}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <SmartImage
            src={experience.image}
            alt={experience.title}
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-exp-ink via-exp-ink/35 to-transparent" />

          <span className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
            {category.short}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            {experience.rating > 0 && (
              <p className="mb-2 flex items-center gap-1 text-xs text-white/80">
                <Star className="h-3.5 w-3.5 fill-exp-marigold text-exp-marigold" />
                {experience.rating.toFixed(1)}
                <span className="text-white/50">({experience.reviews})</span>
              </p>
            )}
            <h3 className="font-display text-2xl leading-tight">{experience.title}</h3>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70">
              {experience.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {experience.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {experience.duration}
              </span>
            </p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-sm">
                {experience.price > 0 ? (
                  <>
                    <span className="text-white/60">From </span>
                    <span className="font-semibold text-exp-marigold">{formatINR(experience.price)}</span>
                    <span className="text-white/60">/{experience.isPriceByGuest ? 'person' : 'group'}</span>
                  </>
                ) : (
                  <span className="text-white/70">Price on inquiry</span>
                )}
              </p>
              <span className="flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[var(--accent)] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onToggleLike(experience.id)}
        aria-pressed={isLiked}
        aria-label={isLiked ? 'Remove from favourites' : 'Save to favourites'}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 backdrop-blur-md transition-transform hover:scale-110 active:scale-90"
      >
        <Heart className={cn('h-4 w-4', isLiked ? 'fill-exp-coral text-exp-coral' : 'text-white')} />
      </button>
    </article>
  );
};

export default ExperienceTile;
