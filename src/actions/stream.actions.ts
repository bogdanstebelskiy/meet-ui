"use server";

import { clientConfig } from "@/config/client";
import { serverConfig } from "@/config/server";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = clientConfig.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = serverConfig.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const iat = Math.floor(Date.now() / 1000) - 60;

  const token = client.generateUserToken({ user_id: user.id, exp, iat });

  return token;
};
