import { useQuery } from '@tanstack/react-query';
import { landingService } from '../services/landingService';

export interface DestinationPanelDef {
  id: string;
  name: string;
  /** Short place token used for location_query search */
  query: string;
  tagline: string;
  badge: string;
  rating: number;
  image: string;
}

export interface DestinationPanel extends DestinationPanelDef {
  staysCount: number;
}

export const CURATED_DESTINATIONS: DestinationPanelDef[] = [
  {
    id: 'idukki',
    name: 'Idukki',
    query: 'Idukki',
    tagline: 'Tea hills, dams & highland homestays across the Western Ghats',
    badge: 'Hill District',
    rating: 4.9,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Idukki_Arch_Dam.jpg/960px-Idukki_Arch_Dam.jpg',
  },
  {
    id: 'kottayam',
    name: 'Kottayam',
    query: 'Kottayam',
    tagline: 'Rubber country, lake shores & heritage Syrian Christian homes',
    badge: 'Lake Country',
    rating: 4.88,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vembanad_Lake_at_Kumarakom.jpg/960px-Vembanad_Lake_at_Kumarakom.jpg',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    query: 'Munnar',
    tagline: 'Misty tea gardens & cool hill station homestays',
    badge: 'Hill Retreats',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  },
  {
    id: 'alappuzha',
    name: 'Alleppey (Alappuzha)',
    query: 'Alleppey',
    tagline: 'Venice of the East & backwater canal villas',
    badge: 'Backwaters',
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600&h=400&fit=crop',
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    query: 'Wayanad',
    tagline: 'Emerald rainforests, waterfalls & treehouses',
    badge: 'Eco Living',
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=400&fit=crop',
  },
  {
    id: 'varkala',
    name: 'Varkala',
    query: 'Varkala',
    tagline: 'Cliffside sea views & golden Arabian coast',
    badge: 'Coastal Escapes',
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=600&h=400&fit=crop',
  },
  {
    id: 'fort-kochi',
    name: 'Fort Kochi',
    query: 'Kochi',
    tagline: 'Colonial heritage, spice markets & Chinese fishing nets',
    badge: 'Culture & Art',
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
  },
  {
    id: 'thekkady',
    name: 'Thekkady',
    query: 'Thekkady',
    tagline: 'Periyar wildlife, spice plantations & bamboo rafting',
    badge: 'Wildlife & Spice',
    rating: 4.86,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop',
  },
  {
    id: 'kumarakom',
    name: 'Kumarakom',
    query: 'Kumarakom',
    tagline: 'Vembanad lake serenity & bird sanctuary walks',
    badge: 'Lake Hideaways',
    rating: 4.91,
    image: 'https://www.tusktravel.com/blog/wp-content/uploads/2022/03/Kerala-kumarakom-Place.jpg',
  },
  {
    id: 'kovalam',
    name: 'Kovalam',
    query: 'Kovalam',
    tagline: 'Lighthouse beach & traditional Ayurvedic wellness',
    badge: 'Ayurveda & Sun',
    rating: 4.82,
    image: 'https://cdn.guidetour.in/wp-content/uploads/2018/01/Kovalam-Tourist-Places.jpg.webp',
  },
];

/**
 * Resolves curated destination panels to those with at least one ACTIVE+APPROVED property.
 */
export function useDestinationPanels() {
  return useQuery({
    queryKey: ['landing-destination-panels'],
    queryFn: async (): Promise<DestinationPanel[]> => {
      const results = await Promise.all(
        CURATED_DESTINATIONS.map(async (dest) => {
          try {
            const res = await landingService.searchProperties({
              page: 1,
              limit: 1,
              status: ['ACTIVE'],
              verification_status: ['APPROVED'],
              location_query: dest.query,
            });
            return {
              ...dest,
              staysCount: res.pagination?.total ?? 0,
            };
          } catch {
            return { ...dest, staysCount: 0 };
          }
        })
      );

      return results.filter((dest) => dest.staysCount > 0);
    },
    staleTime: 1000 * 60 * 5,
  });
}
