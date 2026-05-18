// All mock data lives here — swap with real API responses later.
// Image URLs use Unsplash so screens render even without local assets.

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
    date: "Mar 10, 2026",
    title: "House warming",
    subtitle: "Family functions",
    guests: 120,
    count: 120,
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=80",
  },
  {
    id: "e2",
    date: "Mar 10, 2026",
    title: "Engagement",
    subtitle: "Wedding",
    guests: 120,
    count: 100,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
  {
    id: "e3",
    date: "Mar 12, 2026",
    title: "Candy-light Dinner",
    subtitle: "Life's moments",
    guests: 121,
    count: 250,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  },
  {
    id: "e4",
    date: "Mar 14, 2026",
    title: "Temple date",
    subtitle: "Family functions",
    guests: 130,
    count: 40,
    image:
      "https://images.unsplash.com/photo-1604608672516-f1b9b1d1f5fd?w=600&q=80",
  },
  {
    id: "e5",
    date: "Mar 20, 2026",
    title: "Ramya's Maternity",
    subtitle: "Grand Celebration",
    guests: 220,
    count: 200,
    image:
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&q=80",
  },
  {
    id: "e6",
    date: "Mar 30, 2026",
    title: "Bali tour",
    subtitle: "Trip's",
    guests: 340,
    count: 200,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
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
      },
      {
        id: "plan",
        icon: "star-outline" as const,
        title: "My Plan",
        subtitle: "Manage your Pro plan",
        badge: "PRO PLAN",
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
      },
      {
        id: "events",
        icon: "calendar-outline" as const,
        title: "Events & Preferences",
        subtitle: "Default settings for events",
      },
      {
        id: "analytics",
        icon: "stats-chart-outline" as const,
        title: "Analytics",
        subtitle: "Activity, Registrations",
      },
    ],
  },
];