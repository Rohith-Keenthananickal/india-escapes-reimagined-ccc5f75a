import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus } from "lucide-react";

interface PortalProps {
  children: React.ReactNode;
  elementId: string;
}

const Portal = ({ children, elementId }: PortalProps) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(elementId);
    let createdElement = false;

    if (!element) {
      element = document.createElement("div");
      element.id = elementId;
      element.style.position = "relative";
      element.style.zIndex = "9999";
      document.body.appendChild(element);
      createdElement = true;
    }

    setContainer(element);

    return () => {
      if (createdElement && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [elementId]);

  return container ? createPortal(children, container) : null;
};

interface GuestCount {
  adults: number;
  children: number;
  rooms: number;
}

interface GuestFilterProps {
  isOpen: boolean;
  onClose: () => void;
  guestCount: GuestCount;
  onGuestChange: (
    type: "adults" | "children" | "rooms",
    value: number | string
  ) => void;
}

const GuestFilter = ({
  isOpen,
  onClose,
  guestCount,
  onGuestChange,
}: GuestFilterProps) => {
  const [roomCount, setRoomCount] = useState(guestCount?.rooms || 1);

  useEffect(() => {
    if (guestCount?.rooms) {
      setRoomCount(guestCount.rooms);
    }
  }, [guestCount?.rooms]);

  if (!isOpen) return null;

  const handleRoomChange = (operation: "increase" | "decrease") => {
    if (operation === "increase") {
      setRoomCount((prev) => Math.min(prev + 1, 5));
    } else {
      setRoomCount((prev) => Math.max(prev - 1, 1));
    }
  };

  return (
    <Portal elementId="guest-portal">
      <div
        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 relative max-w-md w-full animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Add Guests
            </h3>
            <p className="text-gray-600">How many guests will be staying?</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div>
                <div className="font-semibold text-gray-900">Adults</div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-orange-500 hover:text-orange-600"
                  onClick={() => onGuestChange("adults", "decrease")}
                  disabled={guestCount?.adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-bold text-lg">
                  {guestCount?.adults || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-orange-500 hover:text-orange-600"
                  onClick={() => onGuestChange("adults", "increase")}
                  disabled={guestCount?.adults >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div>
                <div className="font-semibold text-gray-900">Children</div>
                <div className="text-sm text-gray-600">Ages 6 to 12</div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-orange-500 hover:text-orange-600"
                  onClick={() => onGuestChange("children", "decrease")}
                  disabled={guestCount?.children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-bold text-lg">
                  {guestCount?.children || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-orange-500 hover:text-orange-600"
                  onClick={() => onGuestChange("children", "increase")}
                  disabled={guestCount?.children >= 8}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div>
                <div className="font-semibold text-gray-900">Rooms</div>
                <div className="text-sm text-gray-600">Number of rooms</div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-orange-500 hover:text-orange-600"
                  onClick={() => handleRoomChange("decrease")}
                  disabled={roomCount <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-bold text-lg">
                  {roomCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full border-2 hover:border-orange-500 hover:text-orange-600"
                  onClick={() => handleRoomChange("increase")}
                  disabled={roomCount >= 5}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 py-3 rounded-xl border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onGuestChange("rooms", roomCount);
                onClose();
              }}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default GuestFilter;
