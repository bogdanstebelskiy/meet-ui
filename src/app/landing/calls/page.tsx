"use client";

export default function Calls() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-balance text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
            This is calls page
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            This provides video communications for sleeping work and
            entertainment – no matter where you were.
          </p>
        </div>

        <div className="text-center">
          <a href="#" className="text-sm text-primary hover:underline">
            About this app
          </a>
        </div>
      </div>
    </section>
  );
}
