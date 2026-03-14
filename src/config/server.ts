if (!process.env.STREAM_SECRET_KEY) {
  console.warn("STREAM_SECRET_KEY is missing");
}

export const serverConfig = {
  STREAM_SECRET_KEY: process.env.STREAM_SECRET_KEY!,
};
