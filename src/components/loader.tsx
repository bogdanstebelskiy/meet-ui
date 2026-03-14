import { Loader as LucideLoader } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LucideLoader className="animate-spin" size={32} />
    </div>
  );
}
