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

export default function VideoSettings() {
  const [selectedCamera, setSelectedCamera] = useState("obs-virtual");
  const [resolution, setResolution] = useState("1080p");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Video Settings</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="camera">Camera</Label>
        <Select value={selectedCamera} onValueChange={setSelectedCamera}>
          <SelectTrigger id="camera">
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="obs-virtual">OBS Virtual Camera</SelectItem>
            <SelectItem value="integrated">Integrated Webcam</SelectItem>
            <SelectItem value="external">External USB Camera</SelectItem>
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
            <div className="text-sm">Camera Preview</div>
            <div className="text-xs mt-1">Enable camera to see preview</div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          Test Camera
        </Button>
      </div>
    </div>
  );
}
