"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettings() {
  const [autoLeave, setAutoLeave] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [contactsOnly, setContactsOnly] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <Label className="font-medium">
            Automatically leave calls without other participants
          </Label>
          <p className="text-sm text-muted-foreground">
            Leave calls when no other participants have joined within a few
            minutes
          </p>
        </div>
        <Switch
          checked={autoLeave}
          onCheckedChange={setAutoLeave}
          aria-label="Auto leave setting"
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <Label className="font-medium">Desktop notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications when calls are incoming or when participants
            join
          </p>
        </div>
        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
          aria-label="Notifications setting"
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <Label className="font-medium">Calls only from contacts list</Label>
          <p className="text-sm text-muted-foreground">
            Only allow incoming calls from your saved contacts
          </p>
        </div>
        <Switch
          checked={contactsOnly}
          onCheckedChange={setContactsOnly}
          aria-label="Contacts only setting"
        />
      </div>

      <div className="pt-4 border-t space-y-3">
        <h4 className="font-medium">Privacy & Data</h4>
        <p className="text-sm text-muted-foreground">
          For more information on how your data is handled, please review our
          privacy policy
        </p>
        <a
          href="#"
          className="text-sm text-primary hover:underline inline-block"
        >
          Learn more about privacy controls...
        </a>
      </div>
    </div>
  );
}
