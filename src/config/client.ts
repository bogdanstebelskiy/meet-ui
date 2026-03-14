if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn("NEXT_PUBLIC_BASE_URL is missing");
}

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  console.warn("NEXT_PUBLIC_STREAM_IO_API_KEY is missing");
}

export const clientConfig = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
  NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
};
