# Journey Popup Feature

## Overview
The PropertyDetails page now includes a smooth transition popup system that guides users through their Kerala journey planning process.

## Features

### First Popup - Side Panel
- **Trigger**: Automatically appears 1 second after page load (first time only)
- **Content**: 
  - "Start your trip from here" (highlighted)
  - "Before we begin planning your Kerala journey… Please let us know the date of your first sleeping day"
- **Functionality**:
  - Side panel slides in from the right
  - "Choose Dates" button that opens the DateFilter modal
  - Selected dates display with option to clear
  - "Continue to Journey" button appears after date selection
  - Smooth transition to second popup

### Second Popup - Journey Content
- **Trigger**: After date selection in first popup
- **Content**:
  - "Your journey. Your choices. Your freedom."
  - "Start building your personalized Kerala trip homestays, local flavours, and cultural experiences, all your way."
  - SDG (Sustainable Development Goals) information
- **Functionality**:
  - Close button to dismiss popup
  - Action buttons for "Start Planning" and "Learn More"
  - Marks popup as seen in localStorage

### Transition Effects
- Smooth fade-in/zoom-in animations for both popups
- Loading overlay during transition between popups
- Backdrop blur effects for modern UI feel

### Manual Trigger
- "Start Journey" button in the header allows users to manually trigger the popup sequence
- Useful for testing or if users want to see the popup again

## Technical Implementation

### State Management
```typescript
const [showFirstPopup, setShowFirstPopup] = useState(false);
const [showSecondPopup, setShowSecondPopup] = useState(false);
const [isTransitioning, setIsTransitioning] = useState(false);
const [showDateFilter, setShowDateFilter] = useState(false);
const [journeyStartDate, setJourneyStartDate] = useState<Date | undefined>();
const [journeyEndDate, setJourneyEndDate] = useState<Date | undefined>();
```

### Persistence
- Uses localStorage to remember if user has seen the popup
- Prevents popup from showing again on subsequent visits
- Can be reset via the "Start Journey" button

### Styling
- Gradient backgrounds for visual appeal
- Responsive design for mobile and desktop
- Modern rounded corners and shadows
- Smooth hover effects and transitions

## Usage

1. Navigate to any property details page
2. Wait 1 second for the side panel to slide in from the right
3. Click "Choose Dates" button to open the date picker modal
4. Select your journey start and end dates using the calendar interface
5. Click "Confirm Dates" to close the date picker modal
6. Review selected dates in the side panel
7. Click "Continue to Journey" to proceed
8. View the second popup with journey information
9. Click "Start Planning" or "Learn More" to close

## Customization

The popup content and styling can be easily customized by modifying:
- Text content in the JSX
- Color schemes in the gradient classes
- Animation timing in the useEffect hooks
- Date picker validation logic 