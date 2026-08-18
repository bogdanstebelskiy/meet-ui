"use client";

import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LocalTile } from "@/components/meeting/tiles/local-tile";
import { useUserSettingsContext } from "@/context/settings-context";

interface VideoSettingsProps {
  availableCameras: MediaDeviceInfo[];
  isLoadingDevices: boolean;
}

export default function VideoSettings({ availableCameras, isLoadingDevices }: VideoSettingsProps) {
  const { videoSettings, setVideoSettings } = useUserSettingsContext();

  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
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
    let stream: MediaStream | null = null;

    const getLocalVideoStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: videoSettings.camera && videoSettings.camera.deviceId },
          },
        });

        setPreviewStream(stream);
      } catch (error) {
        console.error(error);
      }
    };

    getLocalVideoStream().then();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      setPreviewStream(null);
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

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <Label className="font-medium">Mirror my video</Label>
          <p className="text-sm text-muted-foreground">Flip your own preview horizontally, like looking in a mirror</p>
        </div>
        <Switch
          checked={videoSettings.mirrorCamera}
          onCheckedChange={(checked) => setVideoSettings({ mirrorCamera: checked })}
          aria-label="Mirror camera setting"
        />
      </div>

      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="aspect-video overflow-hidden rounded-lg border border-border">
          <LocalTile stream={previewStream} isCamOn={!!previewStream} showLabel={false} />
        </div>
      </div>
    </div>
  );
}
