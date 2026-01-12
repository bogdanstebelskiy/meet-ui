if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn("NEXT_PUBLIC_BASE_URL is missing");
}

export const config = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
};
