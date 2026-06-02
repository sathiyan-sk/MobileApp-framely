// All mock data lives here — swap with real API responses later.
// Image URLs use Unsplash so screens render even without local assets.
// Settings items each carry an optional `route` that the Settings screen uses

// for navigation. Keep this in sync with files under /app/frontend/app/.
export const userMock = {
  name: "Sathya",
  fullName: "Sathiya",
  email: "sathyan@renaiglobal.com",
  initial: "S",
  greeting: "Good morning",
  subtitle: "Here's your dashboard overview",
  plan: "PRO PLAN",
  avatar:
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&q=80",
  notifications: 3,
};

export const statsMock = [
  {
    id: "events",
    label: "Active Events",
    value: "5",
    sub: "3 published",
    icon: "calendar-outline" as const,
    color: "#EC407A",
    bg: "#FCE4EC",
  },
  {
    id: "photos",
    label: "Photos",
    value: "2,662",
    sub: "1,661 ready",
    icon: "images-outline" as const,
    color: "#6366F1",
    bg: "#EEF0FF",
  },
  {
    id: "guests",
    label: "Guest's",
    value: "275",
    sub: "Total guests",
    icon: "people-outline" as const,
    color: "#F59E0B",
    bg: "#FFF4E0",
  },
  {
    id: "storage",
    label: "Storage Used",
    value: "1.5",
    unit: "GB",
    sub: "of 50 GB · 2%",
    icon: "cloud-outline" as const,
    color: "#10B981",
    bg: "#E6FBF4",
  },
];

export const featuredEvents = [
  {
    id: "feat-1",
    badge: "FEATURED EVENT",
    title: "Destination Wedding's",
    location: "Blue Ocean, Goa",
    date: "10 May 2024 · 06:00 PM",
  status: "PUBLISHED",
  pics: "0 / 6 pics",
  image:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  },
  {
    id: "feat-2",
    badge: "FEATURED EVENT",
    title: "Ramya's Maternity",
    location: "Leela Palace, Bengaluru",
    date: "20 Mar 2026 · 05:00 PM",
    status: "PUBLISHED",
    pics: "12 / 200 pics",
    image:
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80",
  },
  {
    id: "feat-3",
    badge: "FEATURED EVENT",
    title: "Candy-light Dinner",
    location: "Marina Bay, Chennai",
    date: "12 Mar 2026 · 08:30 PM",
    status: "DRAFT",
    pics: "0 / 250 pics",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
  },
  {
    id: "feat-4",
    badge: "FEATURED EVENT",
    title: "Bali Tour",
    location: "Ubud, Bali",
    date: "30 Mar 2026 · 10:00 AM",
    status: "PUBLISHED",
    pics: "0 / 340 pics",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  },
];

export const myEvents = [
  {
    id: "e1",
    date: "May 14, 2026",
    title: "Sarah & Daniel Wedding",
        subtitle: "Wedding",
    location: "Sundar Lodge, Salem",
    guests: 128,
    count: 312,
    photos: 312,
    status: "live" as const,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: "e2",
    date: "May 27, 2026",
    title: "Kayal & Krish Wedding",
    subtitle: "Wedding",
    location: "Taj Hotel, Agra",
    guests: 4,
    count: 0,
    photos: 0,
    status: "scheduled" as const,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: "e3",
    date: "May 01, 2026",
    title: "Friends Party",
    location: "Guest House, Ooty",
        subtitle: "Celebration",

    guests: 18,
    photos: 300,
    count : 300,
    status: "completed" as const,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  },
  {
    id: "e4",
    date: "May 14, 2026",
    title: "Pre-Wedding Shoot",
    subtitle: "wedding shoot",
    location: "KPK Mall, A.pattanam",
    guests: 28,
    photos: 12,
    count: 12,
    status: "expired" as const,
    image:
      "https://images.unsplash.com/photo-1604608672516-f1b9b1d1f5fd?w=600&q=80",
  },
  {
    id: "e5",
    date: "May 29, 2026",
    title: "Destination Wedding",
    subtitle: "Wedding",
    location: "Port louis, UK",
    guests: 0,
    photos: 0,
    count: 0,
    status: "draft" as const,
    image:
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&q=80",
  },
  {
    id: "e6",
    date: "Mar 30, 2026",
    title: "Bali tour",
    subtitle: "Trip's",
    location: "Family functions",
    guests: 340,
    photos: 120,
    count: 120,
    status: "live" as const,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
  },
];
// ──────────────────────────────────────────────────────────────────────────────
// EVENTS WORKSPACE MOCK DATA
// ──────────────────────────────────────────────────────────────────────────────
export type EventPublishStatus = 'published' | 'unpublished';
export type EventActivityStatus = 'active' | 'upcoming' | 'expired';

export interface EventWorkspaceItem {
  id: string;
  title: string;
  date: string;
  sortTimestamp: number;
  publishStatus: EventPublishStatus;
  eventStatus: EventActivityStatus;
  guests: number;
  photos: number;
  image: string;
}

export const eventsWorkspaceData: EventWorkspaceItem[] = [
  {
    id: 'ew1',
    title: 'Sarah & James Wedding',
    date: 'Apr 25, 2026',
    sortTimestamp: new Date('2026-04-25').getTime(),
    publishStatus: 'published',
    eventStatus: 'active',
    guests: 320,
    photos: 152,
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  },
  {
    id: 'ew2',
    title: "Meera's Baby Shower",
    date: 'Mar 10, 2026',
    sortTimestamp: new Date('2026-03-10').getTime(),
    publishStatus: 'unpublished',
    eventStatus: 'upcoming',
    guests: 120,
    photos: 98,
    image:
      'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&q=80',
  },
  {
    id: 'ew3',
    title: 'Arun & Priya Engagement',
    date: 'Feb 18, 2026',
    sortTimestamp: new Date('2026-02-18').getTime(),
    publishStatus: 'published',
    eventStatus: 'active',
    guests: 200,
    photos: 210,
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  },
  {
    id: 'ew4',
    title: 'Arun & Priya Engagement',
    date: 'Feb 18, 2026',
    sortTimestamp: new Date('2026-02-18').getTime(),
    publishStatus: 'published',
    eventStatus: 'expired',
    guests: 200,
    photos: 210,
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  },
];

export const recentUploads = [
  {
    id: "u1",
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",
    liked: true,
  },
  {
    id: "u2",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    liked: true,
  },
  {
    id: "u3",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    liked: false,
  },
  {
    id: "u4",
    image:
      "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=600&q=80",
    liked: false,
  },
];

export const activityFeed = [
  {
    id: "a1",
    actor: "Anita",
    action: "uploaded 24 photos to",
    target: "Sarah & James Wedding",
    time: "just now",
    icon: "image-outline" as const,
    tint: "#EC407A",
    bg: "#FCE4EC",
    thumb:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=80",
  },
  {
    id: "a2",
    actor: "Priya",
    action: "liked a photo in",
    target: "Meera's Baby Shower",
    time: "15m ago",
    icon: "heart-outline" as const,
    tint: "#EC407A",
    bg: "#FCE4EC",
    thumb:
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=200&q=80",
  },
  {
    id: "a3",
    actor: "Rahul",
    action: "joined the event",
    target: "Sarah & James Wedding",
    time: "1h ago",
    icon: "people-outline" as const,
    tint: "#EC407A",
    bg: "#FCE4EC",
    thumb:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=200&q=80",
  },
  {
    id: "a4",
    actor: "Sathya",
    action: "created a event in",
    target: "Corporate Events",
    time: "6h ago",
    icon: "image-outline" as const,
    tint: "#EC407A",
    bg: "#FCE4EC",
    thumb:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80",
  },
];

export const guestQR = {
  title: "Guest QR Site",
  subtitle: "Scan to find photos",
  label: "Family Party",
  link: "https://www.framely.com/guest/family-party",
};

export const storagePlan = {
  usedGB: 1.1,
  totalGB: 50,
  percent: 0.99,
  planName: "Pro",
  status: "ACTIVE",
  renews: "Renews 10 May",
  photosUsed: 1662,
  photosTotal: 50000,
};

export const settingsGroups = [
  {
    id: "g1",
    sectionIcon: "person-outline" as const,
    section: "ACCOUNT & SUBSCRIPTION'S",
    items: [
      {
        id: "personal",
        icon: "person-outline" as const,
        title: "Personal Details",
        subtitle: "Name, email, mobile number",
        route: "/(tabs)/edit-profile" as const,
      },
      {
        id: "plan",
        icon: "star-outline" as const,
        title: "My Plan",
        subtitle: "Manage your Pro plan",
        badge: "PRO PLAN",
        route: "/(tabs)/plan" as const,
        },
    ],
  },
  {
    id: "g2",
    sectionIcon: "briefcase-outline" as const,
    section: "BUSINESS",
    items: [
      {
        id: "brand",
        icon: "color-palette-outline" as const,
        title: "Branding & Theme",
        subtitle: "Logo, colors, fonts & themes",
        route: "/(tabs)/branding" as const,
              },
      {
        id: "events",
        icon: "calendar-outline" as const,
        title: "Events & Preferences",
        subtitle: "Default settings for events",
        route: "/(tabs)/events" as const,
      },
      {
        id: "analytics",
        icon: "stats-chart-outline" as const,
        title: "Analytics",
        subtitle: "Activity, Registrations",
        route: "/(tabs)/analytics" as const,

      },
    ],
  },
];


// ──────────────────────────────────────────────────────────────────────────────
// ANALYTICS MOCK  (shape mirrors what the Node API will return)
// ──────────────────────────────────────────────────────────────────────────────
export const analyticsData = {
  range: { from: "Mar 01, 2026", to: "Mar 30, 2026" },
  summary: [
    {
      id: "registrations",
      label: "Registrations",
      value: "5",
      delta: "0%",
      compare: "vs last 6 mo",
      icon: "people-outline" as const,
      color: "#EC407A",
      bg: "#FCE4EC",
    },
    {
      id: "galleryVisit",
      label: "Gallery Visit",
      value: "2",
      delta: "0%",
      compare: "vs last 6 mo",
      icon: "image-outline" as const,
      color: "#10B981",
      bg: "#E6FBF4",
    },
    {
      id: "imageView",
      label: "Image View",
      value: "1,660",
      delta: "0%",
      compare: "vs last 6 mo",
      icon: "eye-outline" as const,
      color: "#F59E0B",
      bg: "#FFF4E0",
    },
    {
      id: "downloads",
      label: "Downloads",
      value: "0",
      delta: "0%",
      compare: "vs last 6 mo",
      icon: "download-outline" as const,
      color: "#6366F1",
      bg: "#EEF0FF",
    },
  ],
  galleryOverTime: {
    metric: "Gallery Visit",
    yAxis: [0, 0.5, 1.0, 1.5, 2.0, 2.5],
    points: [
      { label: "Sep '25", value: 0 },
      { label: "Oct '25", value: 0 },
      { label: "Nov '25", value: 0 },
      { label: "Dec '25", value: 0 },
      { label: "Jan '26", value: 0.5 },
      { label: "Feb '26", value: 0.7 },
      { label: "Mar '26", value: 1.5 },
    ],
  },
  activityByEvent: [
    {
      id: "ev-1",
      name: "Family Party",
      icon: "people" as const,
      color: "#EC407A",
      galleryVisit: 0,
      imageView: 0,
      imageDownload: 0,
    },
    {
      id: "ev-2",
      name: "Test Event",
      icon: "ellipse" as const,
      color: "#F59E0B",
      galleryVisit: 1,
      imageView: 602,
      imageDownload: 0,
    },
    {
      id: "ev-3",
      name: "New Year",
      icon: "calendar" as const,
      color: "#6366F1",
      galleryVisit: 1,
      imageView: 56,
      imageDownload: 0,
    },
    {
      id: "ev-4",
      name: "Farewell Party",
      icon: "gift" as const,
      color: "#6366F1",
      galleryVisit: 1,
      imageView: 501,
      imageDownload: 0,
    },
    {
      id: "ev-5",
      name: "Freshers Party",
      icon: "boat" as const,
      color: "#10B981",
      galleryVisit: 1,
      imageView: 501,
      imageDownload: 0,
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────────
// BRANDING & WATERMARK MOCK
// ──────────────────────────────────────────────────────────────────────────────
export type WatermarkPosition =
  | "top-left" | "top-center" | "top-right"
  | "mid-left" | "center" | "mid-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

export type WatermarkSize = "small" | "medium" | "large";

export const watermarkPositions: { id: WatermarkPosition; label: string }[] = [
  { id: "top-left", label: "Top Left" },
  { id: "top-center", label: "Top Center" },
  { id: "top-right", label: "Top Right" },
  { id: "mid-left", label: "Mid Left" },
  { id: "center", label: "Center" },
  { id: "mid-right", label: "Mid Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "bottom-center", label: "Bottom Center" },
  { id: "bottom-right", label: "Bottom Right" },
];

export const watermarkSizes: { id: WatermarkSize; label: string }[] = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

export const brandingMock = {
  enabled: true,
  studioName: "Your Studio Name",
  logoUri: null as string | null,
  previewImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  position: "top-left" as WatermarkPosition,
  size: "medium" as WatermarkSize,
  opacity: 80,        // 0-100
  marginH: 3,          // %
  marginV: 3,          // %
  logoSpec: {
    format: "PNG with transparent background",
    recommendedSize: "500×500px",
    maxSizeMb: 2,
  },
  note:
    "Watermark applies to both thumbnail and original during upload processing. " +
    "Only photos uploaded after enabling will have the watermark. " +
    "Face detection runs on the clean image before watermarking — so AI recognition is not affected.",
};

// ──────────────────────────────────────────────────────────────────────────────
// PLAN / SUBSCRIPTION MOCK
// ──────────────────────────────────────────────────────────────────────────────
export type PlanTier = "starter" | "pro" | "elite";

export const plansMock: {
  id: PlanTier;
  name: string;
  tagline: string;
  price: number;            // 0 means free
  currency: string;
  period: string;
  icon: "leaf-outline" | "diamond-outline" | "ribbon-outline";
  accent: string;
  features: string[];
  ribbon?: string;
}[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Forever free",
    price: 0,
    currency: "Rs.",
    period: "/ month",
    icon: "leaf-outline",
    accent: "#EC407A",
    features: [
      "10,000 photos",
      "10 GB storage",
      "face recognize",
      "Guest QR code",
      "Unlimited events",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing studios",
    price: 499,
    currency: "Rs.",
    period: "/ month",
    icon: "diamond-outline",
    accent: "#F59E0B",
    ribbon: "BEST VALUE",
    features: [
      "50,000 photos",
      "50 GB storage",
      "AI face recognition",
      "Guest QR code",
      "WhatsApp sharing",
      "Priority processing",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "For professional studios",
    price: 999,
    currency: "Rs.",
    period: "/ month",
    icon: "ribbon-outline",
    accent: "#7C3AED",
    features: [
      "1,00,000 photos",
      "100 GB storage",
      "AI face recognition",
      "Guest QR code",
      "WhatsApp sharing",
      "Priority processing",
      "Dedicated support",
    ],
  },
];

export const activePlanMock = {
  id: "pro" as PlanTier,
  name: "Pro",
  price: 499,
  currency: "Rs.",
  period: "/ month",
  status: "ACTIVE",
  photosUsed: 1662,
  photosTotal: 50000,
  storageUsedGb: 0.05,
  storageTotalGb: 50,
};

// ──────────────────────────────────────────────────────────────────────────────
// MY PLAN DATA (for MyPlanScreen.tsx)
// ──────────────────────────────────────────────────────────────────────────────
export const myPlanData = {
  active: {
    name: "Pro",
    price: "Rs. 499",
    unit: "/ month",
    status: "ACTIVE",
    photosUsed: 1662,
    photosTotal: 50000,
    storageUsedGB: 1.1,
    storageTotalGB: 50,
  },
  plans: [
    {
      id: "starter",
      name: "Starter",
      tagline: "Forever free",
      price: null,
      unit: "/ month",
      icon: "leaf-outline" as const,
      accent: "#EC407A",
      accentSoft: "#FCE4EC",
      bestValue: false,
      features: [
        "10,000 photos",
        "10 GB storage",
        "Face recognition",
        "Guest QR code",
        "Unlimited events",
      ],
      cta: { label: "Current plan", variant: "outline" as const },
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "For growing studios",
      price: "Rs. 499",
      unit: "/ month",
      icon: "diamond-outline" as const,
      accent: "#F59E0B",
      accentSoft: "#FFF4E0",
      bestValue: true,
      features: [
        "50,000 photos",
        "50 GB storage",
        "AI face recognition",
        "Guest QR code",
        "WhatsApp sharing",
        "Priority processing",
      ],
      cta: { label: "Active", variant: "gradient" as const },
    },
    {
      id: "elite",
      name: "Elite",
      tagline: "For professional studios",
      price: "Rs. 999",
      unit: "/ month",
      icon: "ribbon-outline" as const,
      accent: "#7C3AED",
      accentSoft: "#EEF0FF",
      bestValue: false,
      features: [
        "1,00,000 photos",
        "100 GB storage",
        "AI face recognition",
        "Guest QR code",
        "WhatsApp sharing",
        "Priority processing",
        "Dedicated support",
      ],
      cta: { label: "Upgrade to Elite", variant: "purple" as const },
    },
  ],
};  