"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "@/lib/local-storage";

const STORAGE_KEYS = {
  AUDIO: "userSettings_audio",
  VIDEO: "userSettings_video",
  GENERAL: "userSettings_general",
} as const;

interface AudioSettings {
  microphone: MediaDeviceInfo | undefined;
  speaker: MediaDeviceInfo | undefined;
  volume: number;
}

interface VideoSettings {
  camera: MediaDeviceInfo | undefined;
  resolution: string;
  mirrorCamera: boolean;
}

interface GeneralSettings {
  leaveEmptyCalls: boolean;
  desktopNotifications: boolean;
  onlyContactsCalls: boolean;
}

interface UserSettingsContextType {
  audioSettings: AudioSettings;
  videoSettings: VideoSettings;
  generalSettings: GeneralSettings;
  setAudioSettings: (settings: Partial<AudioSettings>) => void;
  setVideoSettings: (settings: Partial<VideoSettings>) => void;
  setGeneralSettings: (settings: Partial<GeneralSettings>) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const useUserSettingsContext = () => {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error("useUserSettingsContext must be used within UserSettingsContextProvider");
  }

  return context;
};

interface UserSettingsContextProviderProps {
  children: ReactNode;
}

export const loadAudioSettingsFromStorage = () =>
  loadFromStorage<AudioSettings>(STORAGE_KEYS.AUDIO, {
    microphone: undefined,
    speaker: undefined,
    volume: 70,
  });

export const loadVideoSettingsFromStorage = () =>
  loadFromStorage<VideoSettings>(STORAGE_KEYS.VIDEO, {
    camera: undefined,
    resolution: "720p",
    mirrorCamera: true,
  });

export const loadGeneralSettingsFromStorage = () =>
  loadFromStorage<GeneralSettings>(STORAGE_KEYS.GENERAL, {
    leaveEmptyCalls: false,
    desktopNotifications: true,
    onlyContactsCalls: false,
  });

export const UserSettingsContextProvider = ({ children }: UserSettingsContextProviderProps) => {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => loadAudioSettingsFromStorage());
  const [videoSettings, setVideoSettings] = useState<VideoSettings>(() => loadVideoSettingsFromStorage());
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(() => loadGeneralSettingsFromStorage());

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AUDIO, audioSettings);
  }, [audioSettings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VIDEO, videoSettings);
  }, [videoSettings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GENERAL, generalSettings);
  }, [generalSettings]);

  const setContextAudioSettings = (settings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => ({ ...prev, ...settings }));
  };

  const setContextVideoSettings = (settings: Partial<VideoSettings>) => {
    setVideoSettings((prev) => ({ ...prev, ...settings }));
  };

  const setContextGeneralSettings = (settings: Partial<GeneralSettings>) => {
    setGeneralSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <UserSettingsContext.Provider
      value={{
        audioSettings,
        videoSettings,
        generalSettings,
        setAudioSettings: setContextAudioSettings,
        setVideoSettings: setContextVideoSettings,
        setGeneralSettings: setContextGeneralSettings,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
