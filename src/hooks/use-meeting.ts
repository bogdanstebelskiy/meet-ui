"use client";

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";

export function useMeeting() {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [error, setError] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  const createMeeting = async (callId: string) => {
    if (!client) throw new Error("Client not ready");

    setIsLoading(true);
    setError(undefined);

    try {
      const newCall = client.call("default", callId);
      await newCall.getOrCreate();
      setCall(newCall);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create meeting";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const joinMeeting = async (callId: string) => {
    if (!client) throw new Error("Client not ready");

    setIsLoading(true);
    setError(undefined);

    try {
      const existingCall = client.call("default", callId);
      //await existingCall.get();
      await existingCall.join();
      setCall(existingCall);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to join meeting";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { call, createMeeting, joinMeeting, error, isLoading };
}
