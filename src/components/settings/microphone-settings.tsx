"use client";

import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useUserSettingsContext } from "@/context/settings-context";
import { Loader2 } from "lucide-react";

interface MicrophoneSettingsProps {
  availableMicrophones: MediaDeviceInfo[];
  availableSpeakers: MediaDeviceInfo[];
  isLoadingDevices: boolean;
}

export default function MicrophoneSettings({
  availableMicrophones,
  availableSpeakers,
  isLoadingDevices,
}: MicrophoneSettingsProps) {
  const [volume, setVolume] = useState([70]);

  const { audioSettings, setAudioSettings } = useUserSettingsContext();

  const handleMicrophoneChange = useCallback(
    (deviceId: string) => {
      const microphoneMediaDeviceInfo = availableMicrophones.find((microphone) => microphone.deviceId === deviceId);
      setAudioSettings({ microphone: microphoneMediaDeviceInfo });
    },
    [availableMicrophones, setAudioSettings],
  );

  const handleSpeakerChange = useCallback(
    (deviceId: string) => {
      const speakerMediaDeviceInfo = availableSpeakers.find((speaker) => speaker.deviceId === deviceId);
      setAudioSettings({ speaker: speakerMediaDeviceInfo });
    },
    [availableSpeakers, setAudioSettings],
  );

  useEffect(() => {
    if (availableMicrophones.length > 0 && !audioSettings.microphone) {
      handleMicrophoneChange(availableMicrophones[0].deviceId);
    }
  }, [availableMicrophones, audioSettings.microphone, handleMicrophoneChange]);

  useEffect(() => {
    if (availableSpeakers.length > 0 && !audioSettings.speaker) {
      handleSpeakerChange(availableSpeakers[0].deviceId);
    }
  }, [availableSpeakers, audioSettings.speaker, handleSpeakerChange]);

  if (isLoadingDevices) {
    return (
      <div className="flex h-full items-center justify-center pb-16">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Microphone Settings</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="microphone">Microphone</Label>
        <Select
          value={audioSettings.microphone && audioSettings.microphone.deviceId}
          onValueChange={handleMicrophoneChange}
          disabled={isLoadingDevices}
        >
          <SelectTrigger id="microphone" className="w-[240px] lg:w-auto">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            {availableMicrophones.map((microphone) => (
              <SelectItem key={microphone.deviceId} value={microphone.deviceId}>
                {microphone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="speaker">Speaker</Label>
        <Select
          value={audioSettings.speaker && audioSettings.speaker.deviceId}
          onValueChange={handleSpeakerChange}
          disabled={isLoadingDevices}
        >
          <SelectTrigger id="speaker" className="w-[240px] lg:w-auto">
            <SelectValue placeholder="Select speaker" />
          </SelectTrigger>
          <SelectContent>
            {availableSpeakers.map((speaker) => (
              <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                {speaker.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="volume">Volume</Label>
        <div className="flex items-center gap-4">
          <Slider id="volume" min={0} max={100} step={1} value={volume} onValueChange={setVolume} className="flex-1" />
          <span className="text-sm text-muted-foreground w-8 text-right">{volume[0]}%</span>
        </div>
      </div>

      <div className="pt-4">
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          Test Microphone
        </Button>
      </div>
    </div>
  );
}
