import { useRef, useState, type CSSProperties } from 'react';
import {
  Check,
  Clock,
  Eye,
  Languages,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Users,
  Wallet,
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { gsap, useGSAP, MQ, formatINR } from '../lib/motion';
import { getCategory } from '../data/experienceContent';
import { useExperienceBooking } from '../hooks/useExperienceBooking';
import type { NormalizedExperience } from '../types/experiences.types';
import { SmartImage } from './SmartImage';

interface ExperienceDetailSheetProps {
  experience: NormalizedExperience | null;
  onOpenChange: (open: boolean) => void;
}

export const ExperienceDetailSheet = ({ experience, onOpenChange }: ExperienceDetailSheetProps) => (
  <Sheet open={!!experience} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      className="w-full overflow-hidden border-l-0 bg-exp-ink p-0 text-white sm:max-w-xl [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-black/50 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100"
    >
      {experience && <DetailBody key={experience.id} experience={experience} />}
    </SheetContent>
  </Sheet>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="detail-reveal border-t border-white/10 py-6">
    <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">{title}</h4>
    {children}
  </section>
);

const DetailBody = ({ experience }: { experience: NormalizedExperience }) => {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const booking = useExperienceBooking(experience);
  const category = getCategory(experience.categorySlug);
  const photos = experience.photos.length ? experience.photos : [experience.image];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOK, () => {
        gsap
          .timeline({ delay: 0.15 })
          .from('.detail-hero-img', { scale: 1.2, duration: 1.4, ease: 'expo.out' }, 0)
          .from('.detail-reveal', { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out' }, 0.1);
      });
    },
    { scope: root }
  );

  const { contextSafe } = useGSAP({ scope: root });
  const showPhoto = contextSafe((i: number) => {
    if (i === active) return;
    gsap.fromTo('.detail-hero-img', { autoAlpha: 0.2, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
    setActive(i);
  });

  const facts = [
    { icon: Clock, label: 'Duration', value: experience.duration },
    { icon: Users, label: 'Group size', value: experience.groupSize ? `Up to ${experience.groupSize}` : 'Flexible' },
    { icon: Languages, label: 'Languages', value: experience.languages.join(', ') || 'Ask host' },
    { icon: Wallet, label: 'Priced', value: experience.isPriceByGuest ? 'Per guest' : 'Per group' },
  ];

  return (
    <div ref={root} className="flex h-full flex-col" style={{ '--accent': category.accent } as CSSProperties}>
      <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
        {/* Gallery */}
        <div className="relative aspect-[4/3] overflow-hidden bg-exp-night">
          <SmartImage src={photos[active]} alt={experience.title} className="detail-hero-img h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-exp-ink via-transparent to-black/30" />
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-5 flex gap-2">
              {photos.map((p, i) => (
                <button
                  key={p}
                  onClick={() => showPhoto(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={cn(
                    'h-12 w-16 overflow-hidden rounded-lg ring-2 transition-all',
                    i === active ? 'ring-[var(--accent)]' : 'opacity-60 ring-transparent hover:opacity-100'
                  )}
                >
                  <SmartImage src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-8 sm:px-8">
          <div className="detail-reveal -mt-2 flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="rounded-full bg-[var(--accent)] px-3 py-1 font-semibold text-white">{category.name}</span>
            {experience.subcategory && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/70">
                <Tag className="h-3 w-3" />
                {experience.subcategory}
              </span>
            )}
          </div>

          <SheetTitle className="detail-reveal mt-4 font-display text-4xl font-normal leading-tight text-white">
            {experience.title}
          </SheetTitle>
          <SheetDescription className="detail-reveal mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
            {experience.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {experience.location}, Kerala
              </span>
            )}
            {experience.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-exp-marigold text-exp-marigold" />
                {experience.rating.toFixed(1)} · {experience.reviews} reviews
              </span>
            )}
          </SheetDescription>

          <div className="detail-reveal mt-6 grid grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <Icon className="mb-2 h-4 w-4 text-[var(--accent)]" />
                <p className="text-[11px] uppercase tracking-wider text-white/45">{label}</p>
                <p className="mt-0.5 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {experience.description && (
            <Section title="About this experience">
              <p className="leading-relaxed text-white/80">{experience.description}</p>
            </Section>
          )}

          {experience.included.length > 0 && (
            <Section title="What’s included">
              <div className="flex flex-wrap gap-2">
                {experience.included.map((item) => (
                  <span key={item} className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-sm">
                    <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {item}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {experience.includedInPrice.length > 0 && (
            <Section title="Covered by the price">
              <ul className="space-y-1.5 text-sm text-white/80">
                {experience.includedInPrice.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {experience.safetyItems.length > 0 && (
            <Section title="Safety">
              <ul className="space-y-2 text-sm text-white/80">
                {experience.safetyItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {experience.legalDeclarations.length > 0 && (
            <section className="detail-reveal border-t border-white/10 pt-5">
              <details className="group text-sm text-white/60">
                <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45 hover:text-white/70">
                  Host declarations <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
                </summary>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {experience.legalDeclarations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
            </section>
          )}
        </div>
      </div>

      {/* Booking bar */}
      <div className="border-t border-white/10 bg-exp-night px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            {experience.price > 0 ? (
              <p className="font-display text-2xl">
                {formatINR(experience.price)}
                <span className="ml-1 font-sans text-xs text-white/50">/ {experience.isPriceByGuest ? 'guest' : 'group'}</span>
              </p>
            ) : (
              <p className="text-sm text-white/70">Price on inquiry</p>
            )}
            {!booking.canBook && <p className="text-xs text-exp-marigold">Preview listing · bookings open soon</p>}
          </div>

          {booking.canBook && !booking.isInCart && (
            <div className="hidden gap-2 sm:flex">
              <input
                type="date"
                value={booking.date}
                min={booking.minDate}
                onChange={(e) => booking.setDate(e.target.value)}
                aria-label="Experience date"
                className="h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white [color-scheme:dark]"
              />
              <select
                value={booking.guests}
                onChange={(e) => booking.setGuests(Number(e.target.value))}
                aria-label="Guests"
                className="h-10 rounded-xl border border-white/15 bg-white/5 px-2 text-xs text-white [color-scheme:dark]"
              >
                {Array.from({ length: Math.max(1, Math.min(experience.groupSize || 6, 12)) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} guest{n === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={booking.addToCart}
            disabled={!booking.canBook || booking.isPending}
            className={cn(
              'inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              booking.isInCart ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gradient-to-r from-exp-coral to-exp-pink text-white hover:brightness-110'
            )}
          >
            {booking.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : booking.isInCart ? (
              <>
                <Eye className="h-4 w-4" /> View cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </>
            )}
          </button>
        </div>

        {/* compact date/guests on small screens */}
        {booking.canBook && !booking.isInCart && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
            <input
              type="date"
              value={booking.date}
              min={booking.minDate}
              onChange={(e) => booking.setDate(e.target.value)}
              aria-label="Experience date"
              className="h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white [color-scheme:dark]"
            />
            <select
              value={booking.guests}
              onChange={(e) => booking.setGuests(Number(e.target.value))}
              aria-label="Guests"
              className="h-10 rounded-xl border border-white/15 bg-white/5 px-2 text-xs text-white [color-scheme:dark]"
            >
              {Array.from({ length: Math.max(1, Math.min(experience.groupSize || 6, 12)) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} guest{n === 1 ? '' : 's'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceDetailSheet;
