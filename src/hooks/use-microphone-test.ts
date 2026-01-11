import { useEffect, useRef, useState } from "react";

export const useMicrophoneTest = (microphoneDeviceId?: string, speakerDeviceId?: string) => {
  const [isTesting, setIsTesting] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaStreamRef = useRef<MediaStream>(null);
  const audioContextRef = useRef<AudioContext>(null);
  const analyserRef = useRef<AnalyserNode>(null);
  const animationFrameRef = useRef<number>(null);

  const detectVoiceActivity = () => {
    if (!analyserRef.current) {
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkVolume = () => {
      if (!analyserRef.current) {
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      setIsTalking(average > 20);

      animationFrameRef.current = requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };

  const setAudioOutputDevice = async (deviceId: string) => {
    try {
      if (!audioRef.current || !(typeof audioRef.current.setSinkId === "function")) {
        console.warn("setSinkId not supported in this browser");
        return;
      }

      await audioRef.current.setSinkId(deviceId);
    } catch (err) {
      console.error("Error setting output device: ", err);
      setError(err instanceof Error ? err.message : "Failed to set output device");
    }
  };

  const startTest = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: microphoneDeviceId } } });
      mediaStreamRef.current = stream;

      audioContextRef.current = new window.AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      if (audioRef.current) {
        audioRef.current.srcObject = stream;

        if (speakerDeviceId) {
          await setAudioOutputDevice(speakerDeviceId);
        }

        await audioRef.current.play();
      }

      setIsTesting(true);
      detectVoiceActivity();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(err instanceof Error ? err.message : "Failed to get devices");
    }
  };

  const stopTest = async () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    setIsTesting(false);
    setIsTalking(false);
  };

  const toggleTest = async () => {
    if (isTesting) {
      await stopTest();
      return;
    }

    await startTest();
  };

  useEffect(() => {
    const run = async () => {
      if (speakerDeviceId && isTesting) {
        await setAudioOutputDevice(speakerDeviceId);
      }
    };

    run().then();
  }, [speakerDeviceId, isTesting]);

  useEffect(() => {
    return () => {
      stopTest().then();
    };
  }, []);

  return {
    isTesting,
    isTalking,
    error,
    audioRef,
    startTest,
    stopTest,
    toggleTest,
  };
};
