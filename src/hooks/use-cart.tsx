import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Hotel {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
  rooms: number;
  totalAmount: number;
}

interface Experience {
  id: number;
  title: string;
  location: string;
  price: number;
  duration: string;
  image: string;
  date?: Date;
  guests: number;
}

interface NearbySuggestion {
  id: string;
  name: string;
  type: string;
  category: string;
  rating?: number;
  distance?: number;
  imageUrl?: string;
  selected: boolean;
}

interface CartState {
  hotels: Hotel[];
  experiences: Experience[];
  nearbySuggestions: NearbySuggestion[];
  addHotel: (hotel: Hotel) => void;
  removeHotel: (hotelId: string) => void;
  updateHotel: (hotelId: string, updates: Partial<Hotel>) => void;
  addExperience: (experience: Experience) => void;
  removeExperience: (experienceId: number) => void;
  updateExperience: (
    experienceId: number,
    updates: Partial<Experience>
  ) => void;
  addNearbySuggestion: (suggestion: NearbySuggestion) => void;
  removeNearbySuggestion: (suggestionId: string) => void;
  toggleNearbySuggestion: (suggestionId: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      hotels: [],
      experiences: [],
      nearbySuggestions: [],

      addHotel: (hotel) =>
        set((state) => ({
          hotels: [...state.hotels.filter((h) => h.id !== hotel.id), hotel],
        })),

      removeHotel: (hotelId) =>
        set((state) => ({
          hotels: state.hotels.filter((h) => h.id !== hotelId),
        })),

      updateHotel: (hotelId, updates) =>
        set((state) => ({
          hotels: state.hotels.map((h) =>
            h.id === hotelId ? { ...h, ...updates } : h
          ),
        })),

      addExperience: (experience) =>
        set((state) => ({
          experiences: [
            ...state.experiences.filter((e) => e.id !== experience.id),
            experience,
          ],
        })),

      removeExperience: (experienceId) =>
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== experienceId),
        })),

      updateExperience: (experienceId, updates) =>
        set((state) => ({
          experiences: state.experiences.map((e) =>
            e.id === experienceId ? { ...e, ...updates } : e
          ),
        })),

      addNearbySuggestion: (suggestion) =>
        set((state) => ({
          nearbySuggestions: [
            ...state.nearbySuggestions.filter((s) => s.id !== suggestion.id),
            suggestion,
          ],
        })),

      removeNearbySuggestion: (suggestionId) =>
        set((state) => ({
          nearbySuggestions: state.nearbySuggestions.filter(
            (s) => s.id !== suggestionId
          ),
        })),

      toggleNearbySuggestion: (suggestionId) =>
        set((state) => ({
          nearbySuggestions: state.nearbySuggestions.map((s) =>
            s.id === suggestionId ? { ...s, selected: !s.selected } : s
          ),
        })),

      clearCart: () =>
        set({
          hotels: [],
          experiences: [],
          nearbySuggestions: [],
        }),

      getTotalAmount: () => {
        const state = get();
        const hotelsTotal = state.hotels.reduce(
          (sum, hotel) => sum + hotel.totalAmount,
          0
        );
        const experiencesTotal = state.experiences.reduce(
          (sum, exp) => sum + exp.price,
          0
        );
        return hotelsTotal + experiencesTotal;
      },

      getTotalItems: () => {
        const state = get();
        return (
          state.hotels.length +
          state.experiences.length +
          state.nearbySuggestions.filter((s) => s.selected).length
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
