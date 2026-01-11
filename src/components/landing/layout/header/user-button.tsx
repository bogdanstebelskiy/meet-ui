import { SignedIn, UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  return (
    <SignedIn>
      <ClerkUserButton />
    </SignedIn>
  );
}
