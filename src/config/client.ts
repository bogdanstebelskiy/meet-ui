if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn("NEXT_PUBLIC_BASE_URL is missing");
}

if (!process.env.NEXT_PUBLIC_SIGNALING_URL) {
  console.warn("NEXT_PUBLIC_SIGNALING_URL is missing");
}

export const clientConfig = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
  NEXT_PUBLIC_SIGNALING_URL: process.env.NEXT_PUBLIC_SIGNALING_URL!,
};
