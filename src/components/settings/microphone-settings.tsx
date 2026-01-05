"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function MicrophoneSettings() {
  const [selectedMic, setSelectedMic] = useState("array");
  const [selectedSpeaker, setSelectedSpeaker] = useState("hd-audio");
  const [volume, setVolume] = useState([70]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Microphone Settings</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="microphone">Microphone</Label>
        <Select value={selectedMic} onValueChange={setSelectedMic}>
          <SelectTrigger id="microphone" className="w-[240px] lg:w-auto">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="array">
              Microphone Array (Intel® Smart Sound Technology)
            </SelectItem>
            <SelectItem value="builtin">Built-in Microphone</SelectItem>
            <SelectItem value="usb">USB Microphone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="speaker">Speaker</Label>
        <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
          <SelectTrigger id="speaker" className="w-[240px] lg:w-auto">
            <SelectValue placeholder="Select speaker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hd-audio">
              S22E390 (HD Audio Driver for Display Audio)
            </SelectItem>
            <SelectItem value="builtin">Built-in Speaker</SelectItem>
            <SelectItem value="usb">USB Speaker</SelectItem>
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
            value={volume}
            onValueChange={setVolume}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-8 text-right">
            {volume[0]}%
          </span>
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
