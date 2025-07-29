import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { createPortal } from "react-dom";
import { format, isValid } from "date-fns";

interface PortalProps {
  children: React.ReactNode;
  elementId: string;
}

const Portal = ({ children, elementId }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let element = document.getElementById(elementId);
    if (!element) {
      element = document.createElement("div");
      element.id = elementId;
      document.body.appendChild(element);
    }

    return () => {
      const portal = document.getElementById(elementId);
      if (portal && portal.childNodes.length === 0) {
        document.body.removeChild(portal);
      }
    };
  }, [elementId]);

  if (!mounted) return null;

  let portalElement = document.getElementById(elementId);
  if (!portalElement) {
    portalElement = document.createElement("div");
    portalElement.id = elementId;
    document.body.appendChild(portalElement);
  }

  return createPortal(children, portalElement);
};

interface DateFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDates: (dateRange: { from: Date; to: Date }) => void;
  initialDateRange?: { from?: Date; to?: Date };
  currentDateRange?: { from: Date; to: Date };
}

const DateFilter = ({
  isOpen,
  onClose,
  onSelectDates,
  initialDateRange,
  currentDateRange,
}: DateFilterProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    initialDateRange?.from
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    initialDateRange?.to
  );
  const [activeSection, setActiveSection] = useState<"checkin" | "checkout">(
    "checkin"
  );

  useEffect(() => {
    if (initialDateRange?.from) setCheckInDate(initialDateRange.from);
    if (initialDateRange?.to) setCheckOutDate(initialDateRange.to);
  }, [initialDateRange]);

  useEffect(() => {
    if (currentDateRange?.from) setCheckInDate(currentDateRange.from);
    if (currentDateRange?.to) setCheckOutDate(currentDateRange.to);
  }, [currentDateRange]);

  const handleDateSelect = (date: Date) => {
    if (activeSection === "checkin") {
      setCheckInDate(date);
      setActiveSection("checkout");
    } else {
      setCheckOutDate(date);
    }
  };

  const handleConfirm = () => {
    if (checkInDate && checkOutDate) {
      onSelectDates({ from: checkInDate, to: checkOutDate });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Portal elementId="date-filter-portal">
      <div
        className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 z-10"
            onClick={onClose}
            aria-label="Close date picker"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Select Your Dates
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Choose your check-in and check-out dates
            </p>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveSection("checkin")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeSection === "checkin"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Select check-in date"
            >
              <div className="text-xs text-gray-500 mb-1">CHECK-IN</div>
              <div className="font-semibold">
                {checkInDate
                  ? checkInDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "Select date"}
              </div>
            </button>
            <button
              onClick={() => setActiveSection("checkout")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeSection === "checkout"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Select check-out date"
            >
              <div className="text-xs text-gray-500 mb-1">CHECK-OUT</div>
              <div className="font-semibold">
                {checkOutDate
                  ? checkOutDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "Select date"}
              </div>
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <CalendarPicker
              mode="range"
              selected={{
                from: checkInDate,
                to: checkOutDate,
              }}
              onSelect={(range) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Handle date selection more carefully
                if (range?.from) {
                  const fromDate = new Date(range.from);
                  fromDate.setHours(0, 0, 0, 0);

                  if (fromDate >= today) {
                    setCheckInDate(fromDate);

                    // If we have a valid range with both dates
                    if (range?.to && range.to > range.from) {
                      const toDate = new Date(range.to);
                      toDate.setHours(0, 0, 0, 0);
                      setCheckOutDate(toDate);
                    } else {
                      // Clear checkout date and switch to checkout mode
                      setCheckOutDate(undefined);
                      setActiveSection("checkout");
                    }
                  }
                }
              }}
              numberOfMonths={window.innerWidth >= 1024 ? 2 : 1}
              className="border-0 shadow-none"
              disabled={(date) => {
                if (!isValid(date)) return true;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dateOnly = new Date(date);
                dateOnly.setHours(0, 0, 0, 0);

                // Disable past dates
                if (dateOnly < today) return true;

                // If we have a check-in date, disable dates before or equal to it for checkout
                if (activeSection === "checkout" && checkInDate) {
                  const checkInDateOnly = new Date(checkInDate);
                  checkInDateOnly.setHours(0, 0, 0, 0);
                  return dateOnly <= checkInDateOnly;
                }

                return false;
              }}
              classNames={{
                months:
                  "flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8",
                month: "space-y-4",
                caption:
                  "flex justify-center pt-1 relative items-center text-lg font-semibold text-gray-900",
                caption_label: "text-lg font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-orange-50 rounded-lg transition-all",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-gray-500 rounded-md w-8 sm:w-10 font-normal text-xs sm:text-sm",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: "h-8 w-8 sm:h-10 sm:w-10 p-0 font-normal hover:bg-orange-100 rounded-lg transition-colors text-xs sm:text-sm",
                day_selected:
                  "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 font-semibold",
                day_today: "bg-orange-100 text-orange-900 font-semibold",
                day_outside: "hidden",
                day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                day_hidden: "invisible",
                day_range_middle:
                  "bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold",
                day_range_end:
                  "bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold",
              }}
              showOutsideDays={false}
              fixedWeeks={false}
              pagedNavigation={true}
              defaultMonth={checkInDate || new Date()}
              weekStartsOn={0} // 0 for Sunday
              formatters={{
                formatWeekdayName: (date) => {
                  return format(date, "EEE").substring(0, 2);
                },
                formatDay: (date) => {
                  return format(date, "d");
                },
              }}
            />
          </div>

          {checkInDate && checkOutDate && (
            <div className="mb-6 flex justify-center">
              <div className="flex items-center space-x-4 sm:space-x-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl px-4 sm:px-8 py-4 sm:py-6 border border-orange-100">
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Check-in
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    {checkInDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full shadow-sm">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                    Check-out
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900">
                    {checkOutDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 sm:px-8 py-3 rounded-xl border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!checkInDate || !checkOutDate}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              Confirm Dates
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DateFilter;
