# Schedule Booking Page - Component Reference

> Quick reference guide for `ScheduleBookingPageRedesigned.jsx`

---

## Visual Layout

```
┌─────────────────────────────────────────────────┐
│  ← Back                          HEADER         │
│  📅 Schedule Cleaning                           │
│     📍 Home address                             │
├─────────────────────────────────────────────────┤
│  ┌──────────────┬──────────────┐                │
│  │ ⚡ Instant   │ 📅 Schedule  │  BOOKING TYPE  │
│  └──────────────┴──────────────┘                │
├─────────────────────────────────────────────────┤
│  ✨ Standard │ ✨ Deep │ 📦 Move   SERVICE      │
├─────────────────────────────────────────────────┤
│  ▼ 1. Size & Duration          COLLAPSIBLE #1  │
│    ┌─────────┬─────────┐                        │
│    │ 🏠 Size │ 🕐 Hour │        PRICING MODE   │
│    └─────────┴─────────┘                        │
│    IF "By House Size":              [2x badge] │
│    [Studio][1BHK][2BHK][3BHK]→  HOUSE CARDS    │
│    (prices multiplied by service)              │
│    IF "By Hourly Rate":                         │
│    Rate: AED 75/hr (1x) | 150/hr (2x Deep)     │
│    [2hrs][3hrs][4hrs][5hrs]→    HOURLY CARDS   │
│    (prices multiplied by service)              │
├─────────────────────────────────────────────────┤
│  ▼ 2. Date & Time              COLLAPSIBLE #2  │
│    [THU][FRI][SAT][SUN][MON]→   DATE PICKER    │
│    [More dates ▼]                               │
│    ┌─────────────────────────┐                  │
│    │ Morning│Aftern│Evening │   TIME TABS      │
│    └─────────────────────────┘                  │
│    [6AM][7AM][8AM]              TIME GRID      │
│    [9AM][10AM][11AM]                           │
├─────────────────────────────────────────────────┤
│  Booking Summary    2 BHK • Feb 6 • 10:00      │
│  [Pay Now ▼]                    AED 300        │
│  ┌─────────────────────────────────────────┐   │
│  │      Confirm Booking  →                 │   │  STICKY CTA
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
ScheduleBookingPageRedesigned
│
├── Navbar
│
├── Header Section (inline)
│   ├── Back button
│   ├── Page icon + title
│   └── Address display
│
├── BookingTypeToggle
│   ├── Instant button
│   └── Schedule button
│
├── ServiceSelector (inline)
│   └── Service cards (Standard | Deep | Move In/Out)
│
├── CollapsibleSection #1: "Size & Duration"
│   ├── PricingModeToggle (inline)
│   │   ├── By House Size
│   │   └── By Hourly Rate
│   ├── HouseSizeCards (when "By House Size" selected)
│   │   └── Studio → 1BHK → 2BHK → 3BHK → 4BHK → 5BHK → Villa
│   └── HourlyRateCards (when "By Hourly Rate" selected)
│       ├── Rate info banner (shows hourly rate + multiplier)
│       └── 2hrs → 3hrs → 4hrs → 5hrs → 6hrs → 7hrs → 8hrs
│
├── CollapsibleSection #2: "Date & Time"
│   ├── DatePickerHorizontal
│   │   ├── 7-day horizontal pills
│   │   └── Expandable full calendar
│   └── TimeSlotPicker
│       ├── Period tabs (Morning | Afternoon | Evening)
│       └── Time slots grid (3 columns)
│
├── Instant Booking Info Card (instant mode only)
│
└── StickyBookingCTA (fixed bottom)
    ├── Booking summary
    ├── Payment selector
    ├── Price display
    └── Confirm button
```

---

## File Locations

| Component | File |
|-----------|------|
| Main Page | `src/pages/ScheduleBookingPageRedesigned.jsx` |
| BookingTypeToggle | `src/components/booking/BookingTypeToggle.jsx` |
| HouseSizeCards | `src/components/booking/HouseSizeCards.jsx` |
| DatePickerHorizontal | `src/components/booking/DatePickerHorizontal.jsx` |
| TimeSlotPicker | `src/components/booking/TimeSlotPickerNew.jsx` |
| StickyBookingCTA | `src/components/booking/StickyBookingCTA.jsx` |
| CollapsibleSection | `src/components/ui/CollapsibleSection.jsx` |

---

## Element Reference

### Header Section
| Element | How to reference |
|---------|------------------|
| Back button | "Header **back button**" |
| Page icon | "Header **page icon**" |
| Title | "Header **title**" |
| Address | "Header **address display**" |
| Background | "Header **background gradient**" |

### BookingTypeToggle
| Element | How to reference |
|---------|------------------|
| Container | "BookingTypeToggle **container**" |
| Instant button | "BookingTypeToggle **Instant option**" |
| Schedule button | "BookingTypeToggle **Schedule option**" |
| Active state | "BookingTypeToggle **active state**" |

### ServiceSelector
| Element | How to reference |
|---------|------------------|
| Grid layout | "ServiceSelector **grid**" |
| Service card | "ServiceSelector **card**" |
| Icon box | "ServiceSelector **icon box**" |
| Checkmark | "ServiceSelector **checkmark**" |
| Selected state | "ServiceSelector **selected state**" |

### PricingModeToggle
| Element | How to reference |
|---------|------------------|
| Size option | "PricingModeToggle **size option**" |
| Hourly option | "PricingModeToggle **hourly option**" |
| Icon circle | "PricingModeToggle **icon circle**" |
| Active state | "PricingModeToggle **active state**" |

### CollapsibleSection
| Element | How to reference |
|---------|------------------|
| Card container | "CollapsibleSection **card**" |
| Accent border | "CollapsibleSection **accent border**" |
| Icon box | "CollapsibleSection **icon box**" |
| Checkmark | "CollapsibleSection **checkmark**" |
| Section number | "CollapsibleSection **number**" |
| Title | "CollapsibleSection **title**" |
| Summary | "CollapsibleSection **summary**" |
| Chevron | "CollapsibleSection **chevron**" |

### HouseSizeCards (shown when "By House Size" selected)
| Element | How to reference |
|---------|------------------|
| Multiplier badge | "HouseSizeCards **multiplier badge**" |
| Scroll container | "HouseSizeCards **scroll container**" |
| Left/Right arrows | "HouseSizeCards **arrows**" |
| Size card | "HouseSizeCards **card**" |
| Checkmark badge | "HouseSizeCards **checkmark**" |
| Card icon | "HouseSizeCards **card icon**" |
| Size label | "HouseSizeCards **size label**" |
| Duration | "HouseSizeCards **duration**" |
| Base price (strikethrough) | "HouseSizeCards **base price**" |
| Total price | "HouseSizeCards **total price**" |
| Selected state | "HouseSizeCards **selected state**" |

### HourlyRateCards (shown when "By Hourly Rate" selected)
| Element | How to reference |
|---------|------------------|
| Rate info banner | "HourlyRateCards **rate banner**" |
| Hourly rate display | "HourlyRateCards **hourly rate**" |
| Multiplier badge | "HourlyRateCards **multiplier badge**" |
| Scroll container | "HourlyRateCards **scroll container**" |
| Left/Right arrows | "HourlyRateCards **arrows**" |
| Hour card | "HourlyRateCards **card**" |
| Checkmark badge | "HourlyRateCards **checkmark**" |
| Card icon (Clock) | "HourlyRateCards **card icon**" |
| Hours label | "HourlyRateCards **hours label**" |
| Calculation breakdown | "HourlyRateCards **breakdown**" |
| Base price (strikethrough) | "HourlyRateCards **base price**" |
| Total price | "HourlyRateCards **total price**" |
| Selected state | "HourlyRateCards **selected state**" |

---

## Service Multipliers (applies to both modes)

| Service | Multiplier | Hourly Rate | Example: Studio (base AED 150) |
|---------|------------|-------------|-------------------------------|
| Standard Cleaning | 1x | AED 75/hr | AED 150 |
| Deep Cleaning | 2x | AED 150/hr | AED 300 |
| Move In/Out | 2.5x | AED 187.5/hr | AED 375 |

### DatePickerHorizontal
| Element | How to reference |
|---------|------------------|
| Day pill | "DatePicker **day pill**" |
| Day name | "DatePicker **day name**" |
| Day number | "DatePicker **day number**" |
| Today highlight | "DatePicker **today highlight**" |
| Selected state | "DatePicker **selected state**" |
| More dates button | "DatePicker **more dates button**" |
| Full calendar | "DatePicker **full calendar**" |

### TimeSlotPicker
| Element | How to reference |
|---------|------------------|
| Tabs row | "TimeSlotPicker **tabs row**" |
| Morning tab | "TimeSlotPicker **Morning tab**" |
| Afternoon tab | "TimeSlotPicker **Afternoon tab**" |
| Evening tab | "TimeSlotPicker **Evening tab**" |
| Active tab | "TimeSlotPicker **active tab**" |
| Time grid | "TimeSlotPicker **time grid**" |
| Time slot | "TimeSlotPicker **time slot**" |
| Selected slot | "TimeSlotPicker **selected slot**" |
| Unavailable slot | "TimeSlotPicker **unavailable slot**" |

### StickyBookingCTA
| Element | How to reference |
|---------|------------------|
| Container | "StickyBookingCTA **container**" |
| Shadow | "StickyBookingCTA **shadow**" |
| Summary label | "StickyBookingCTA **summary label**" |
| Summary value | "StickyBookingCTA **summary value**" |
| Payment dropdown | "StickyBookingCTA **payment dropdown**" |
| Original price | "StickyBookingCTA **original price**" |
| Current price | "StickyBookingCTA **price**" |
| Savings text | "StickyBookingCTA **savings**" |
| Confirm button | "StickyBookingCTA **confirm button**" |
| Button text | "StickyBookingCTA **button text**" |
| Loading state | "StickyBookingCTA **loading state**" |
| Disabled state | "StickyBookingCTA **disabled state**" |

---

## User Flow

```
1. User lands on page
   └── Sees BookingTypeToggle (Instant vs Schedule)
        │
2. Selects booking type
   └── If Instant: skips date/time selection
   └── If Schedule: continues to step 3
        │
3. Selects service type
   └── Standard / Deep / Move In/Out
        │
4. Opens Section 1: Size & Duration
   └── Picks house size from HouseSizeCards
   └── Auto-advances to next section
        │
5. Opens Section 2: Date & Time
   └── Picks date from DatePickerHorizontal
   └── Picks time from TimeSlotPicker
        │
6. StickyBookingCTA appears
   └── Shows summary + price
   └── User selects Pay Now / Pay Later
        │
7. Clicks "Confirm Booking"
   └── API call → Success → Navigate to confirmation
```

---

## Example Change Requests

```
"Make the HouseSizeCards price font bigger"
"Change the TimeSlotPicker active tab color to blue"
"Remove the StickyBookingCTA savings text"
"Add a tooltip to the BookingTypeToggle Instant option"
"Change the DatePicker day pill to show month name"
"Make the CollapsibleSection chevron spin instead of flip"
```
