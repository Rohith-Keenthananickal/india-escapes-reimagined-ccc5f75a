export { wishlistService } from './services/wishlistService';
export {
  useWishlistQuery,
  useWishlistIdsQuery,
  WISHLIST_QUERY_KEY,
  WISHLIST_IDS_QUERY_KEY,
} from './hooks/useWishlist';
export { useWishlistMutations } from './hooks/useWishlistMutations';
export type {
  WishlistItem,
  WishlistItemCreate,
  WishlistItemUpdate,
  WishlistPropertySummary,
} from './types/wishlist.types';
