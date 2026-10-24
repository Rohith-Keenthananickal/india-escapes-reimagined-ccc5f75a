import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ImageOff } from 'lucide-react';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
  classification?: string;
  isVerified?: boolean;
}

export const PropertyImageGallery = ({
  images,
  title,
  classification,
  isVerified,
}: PropertyImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 text-center border border-gray-200">
        <ImageOff className="w-12 h-12 mb-2 text-gray-300" />
        <h4 className="font-semibold text-gray-700">No photos uploaded</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          The host has not added photos for this property yet.
        </p>
      </div>
    );
  }

  const mainImage = images[0];
  const thumbnails = images.slice(1, 5);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden h-[420px]">
        {/* Main large image */}
        <div
          className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group bg-gray-100"
          onClick={() => setSelectedImage(mainImage)}
        >
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {classification && classification !== 'UNCLASSIFIED' && (
              <Badge className="bg-white/90 text-gray-900 border font-bold">
                {classification}
              </Badge>
            )}
            {isVerified && (
              <Badge className="bg-blue-600 text-white font-medium">
                Verified Homestay
              </Badge>
            )}
          </div>
        </div>

        {/* Thumbnail grid */}
        {thumbnails.length > 0 ? (
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            {thumbnails.map((img, i) => (
              <div
                key={i}
                className="relative h-[202px] cursor-pointer overflow-hidden group rounded-lg bg-gray-100"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`${title} - photo ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex md:col-span-2 items-center justify-center bg-gray-50 rounded-lg text-gray-400 text-xs">
            No additional photos
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={Boolean(selectedImage)} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 border-0">
          <DialogTitle className="sr-only">Photo preview: {title}</DialogTitle>
          {selectedImage && (
            <img
              src={selectedImage}
              alt={title}
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyImageGallery;
