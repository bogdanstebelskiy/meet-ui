"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Mic, Video, Settings2 } from "lucide-react";
import { useState } from "react";
import VideoSettings from "@/components/settings/video-settings";
import MicrophoneSettings from "@/components/settings/microphone-settings";
import GeneralSettings from "@/components/settings/general-settings";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMediaDevices } from "@/app/hooks/use-media-devices";

export default function SettingsDialog() {
  const [activeTab, setActiveTab] = useState("microphone");

  const { availableMicrophones, availableSpeakers, isLoadingDevices } = useMediaDevices();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-controls="dialog">
          <Settings className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
        <VisuallyHidden>
          <DialogTitle>Settings</DialogTitle>
        </VisuallyHidden>
        <DialogHeader className="border-b px-6 py-4 sm:text-left">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-row flex-1 gap-0 p-0 max-h-96 sm:h-[500px]"
        >
          <TabsList className="flex flex-col justify-start items-start h-auto border-r w-16 sm:w-40 rounded-none px-2 py-3 sm:px-4 sm:py-4 gap-2 bg-background">
            <div>
              <TabsTrigger
                value="microphone"
                className="w-full h-[50px] justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2 data-[state=active]:bg-background"
              >
                <Mic className="size-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">Microphone</span>
              </TabsTrigger>
              <TabsTrigger
                value="video"
                className="w-full h-[50px] justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2 data-[state=active]:bg-background"
              >
                <Video className="size-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">Video</span>
              </TabsTrigger>
              <TabsTrigger
                value="general"
                className="w-full h-[50px] justify-center sm:justify-start gap-2 px-2 sm:px-3 py-2 data-[state=active]:bg-background"
              >
                <Settings2 className="size-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">General</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="microphone" className="mt-0 h-96 flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <MicrophoneSettings
              availableMicrophones={availableMicrophones}
              availableSpeakers={availableSpeakers}
              isLoadingDevices={isLoadingDevices}
            />
          </TabsContent>

          <TabsContent value="video" className="mt-0 h-96 flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <VideoSettings />
          </TabsContent>

          <TabsContent value="general" className="mt-0 h-96 flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <GeneralSettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
