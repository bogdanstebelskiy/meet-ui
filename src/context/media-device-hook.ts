"use client";

import { useState, useEffect } from "react";

export const useMediaDevices = () => {
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [availableSpeakers, setAvailableSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshDevices = async () => {
    setIsLoadingDevices(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();

      const mics = devices.filter((device) => device.kind === "audioinput");

      const speakers = devices.filter((device) => device.kind === "audiooutput");

      const cameras = devices.filter((device) => device.kind === "videoinput");

      setAvailableMicrophones(mics);
      setAvailableSpeakers(speakers);
      setAvailableCameras(cameras);
    } catch (err) {
      console.error("Error getting media devices:", err);
      setError(err instanceof Error ? err.message : "Failed to get devices");
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    refreshDevices().then();

    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", refreshDevices);
    };
  }, []);

  return {
    availableMicrophones,
    availableSpeakers,
    availableCameras,
    refreshDevices,
    isLoadingDevices,
    error,
  };
};
