"use client";

import { useEffect } from "react";
import { useMeeting } from "@/hooks/use-meeting";
import { clientConfig } from "@/config/client";
import Loader from "@/components/loader";

export default function RoomPage() {
  const { isLoading, error, joinMeeting } = useMeeting();

  const extractCode = (value: string) => {
    return value
      .replace(clientConfig.NEXT_PUBLIC_BASE_URL, "")
      .replace(/^\/?meeting\//, "")
      .replace(/^\/+/, "");
  };

  useEffect(() => {
    const url = window.location.href;
    const code = extractCode(url);

    joinMeeting(code).then();

    // We can ignore this warning because we only want to join the meeting once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  return <div className="flex items-center justify-center h-screen">Room Page</div>;
}
