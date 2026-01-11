"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserSettingsContext } from "@/context/settings-context";

interface VideoSettingsProps {
  availableCameras: MediaDeviceInfo[];
  isLoadingDevices: boolean;
}

export default function VideoSettings({ availableCameras, isLoadingDevices }: VideoSettingsProps) {
  const { videoSettings, setVideoSettings } = useUserSettingsContext();

  const localVideoStream = useRef<MediaStream>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [resolution, setResolution] = useState("1080p");

  const handleCameraChange = useCallback(
    (deviceId: string) => {
      const videoMediaDeviceInfo = availableCameras.find((camera) => camera.deviceId === deviceId);
      setVideoSettings({ camera: videoMediaDeviceInfo });
    },
    [availableCameras, setVideoSettings],
  );

  useEffect(() => {
    if (availableCameras.length > 0 && !videoSettings.camera) {
      handleCameraChange(availableCameras[0].deviceId);
    }
  }, [availableCameras, handleCameraChange, videoSettings.camera]);

  useEffect(() => {
    const getLocalVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: videoSettings.camera && videoSettings.camera.deviceId },
          },
        });

        localVideoStream.current = stream;

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    };

    getLocalVideoStream().then();

    return () => {
      if (localVideoStream.current) {
        localVideoStream.current.getTracks().forEach((track) => track.stop());
        localVideoStream.current = null;
      }
    };
  }, [videoSettings.camera]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Video Settings</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="camera">Camera</Label>
        <Select
          value={videoSettings.camera && videoSettings.camera.deviceId}
          onValueChange={handleCameraChange}
          disabled={isLoadingDevices}
        >
          <SelectTrigger id="camera">
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            {availableCameras.map((camera) => (
              <SelectItem key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resolution">Resolution</Label>
        <Select value={resolution} onValueChange={setResolution}>
          <SelectTrigger id="resolution">
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="720p">720p (HD)</SelectItem>
            <SelectItem value="1080p">1080p (Full HD)</SelectItem>
            <SelectItem value="1440p">1440p (2K)</SelectItem>
            <SelectItem value="2160p">2160p (4K)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            {videoRef && <video ref={videoRef} autoPlay playsInline muted className="w-full rounded" />}
          </div>
        </div>
      </div>
    </div>
  );
}
