"use client";

import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useUserSettingsContext } from "@/context/settings-context";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useMicrophoneTest } from "@/hooks/use-microphone-test";

interface AudioSettingsProps {
  availableMicrophones: MediaDeviceInfo[];
  availableSpeakers: MediaDeviceInfo[];
  isLoadingDevices: boolean;
}

export default function AudioSettings({
  availableMicrophones,
  availableSpeakers,
  isLoadingDevices,
}: AudioSettingsProps) {
  const { audioSettings, setAudioSettings } = useUserSettingsContext();

  const [volume, setVolume] = useState(audioSettings.volume || 70);

  const { isTesting, isTalking, error, audioRef, toggleTest } = useMicrophoneTest(
    audioSettings.microphone && audioSettings.microphone.deviceId,
  );

  const debouncedSaveVolume = useDebounce((newVolume: number) => {
    setAudioSettings({ volume: newVolume });
  }, 300);

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

  const handleVolumeChange = useCallback(
    (newVolume: number[]) => {
      setVolume(newVolume[0]);
      debouncedSaveVolume(newVolume[0]);
    },
    [debouncedSaveVolume],
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
        <h3 className="text-lg font-semibold mb-4">Audio Settings</h3>
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
          <Slider
            id="volume"
            min={0}
            max={100}
            step={1}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-8 text-right">{volume}%</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={toggleTest}
          variant="outline"
          className="w-full sm:w-auto bg-transparent flex items-center gap-2"
        >
          {isTesting ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop Test
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Test Microphone
            </>
          )}
        </Button>

        {error && <p className="mt-2 text-sm text-red-500">Error: {error}</p>}

        {isTesting && (
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${isTalking ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span>{isTalking ? "Detecting voice..." : "Speak to test"}</span>
          </div>
        )}

        <audio ref={audioRef} className="hidden"></audio>
      </div>
    </div>
  );
}
