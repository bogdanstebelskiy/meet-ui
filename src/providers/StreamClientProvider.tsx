"use client";

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { clientConfig } from "@/config/client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/loader";

export default function StreamClientProvider({ children }: { children: React.ReactNode }) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    const client = new StreamVideoClient({
      apiKey: clientConfig.NEXT_PUBLIC_STREAM_API_KEY,
      user: {
        id: user && user.id,
        name: (user && user.username) || user.id,
        image: user && user.imageUrl,
      },
      tokenProvider,
    });

    // We can ignore this warning because we only want to set the video client once when the user is loaded
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoClient(client);

    return () => {
      client?.disconnectUser();
      setVideoClient(undefined);
    };
  }, [user, isLoaded]);

  if (!videoClient) {
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
