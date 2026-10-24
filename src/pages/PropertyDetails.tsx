import PropertyDetailsPage from '@/modules/property-details';

/**
 * Route entry point for /property/:id
 * Re-exports the modular PropertyDetailsPage from @/modules/property-details.
 */
const PropertyDetails = () => {
  return <PropertyDetailsPage />;
};

export default PropertyDetails;
