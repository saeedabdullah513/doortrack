export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "DoorTrack",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  attendance: {
    targetHours: 8,
  },

  features: {
    // Toggle photo capture on punch-in. Set NEXT_PUBLIC_PHOTO_CAPTURE_ENABLED=true to enable.
    photoCapture: process.env.NEXT_PUBLIC_PHOTO_CAPTURE_ENABLED === "true",
  },
} as const;
