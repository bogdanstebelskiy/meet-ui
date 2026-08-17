"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Loader from "@/components/loader";
import { MeetingRoomProvider } from "@/providers/meeting-room-provider";
import MeetingSetup from "@/components/meeting/meeting-setup";
import MeetingRoom from "@/components/meeting/meeting-room";

export default function MeetingPage() {
  const params = useParams<{ id: string }>();
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded) {
    return <Loader />;
  }

  const displayName =
    user?.username || user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Anonymous";

  return (
    <div className="h-screen w-full">
      <MeetingRoomProvider roomId={params.id} displayName={displayName}>
        {isSetupComplete ? <MeetingRoom /> : <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />}
      </MeetingRoomProvider>
    </div>
  );
}
