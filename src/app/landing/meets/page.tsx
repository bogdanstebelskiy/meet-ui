"use client";

import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Meets() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-1500 ease-out">
        <div className="space-y-4 text-center">
          <h1 className="text-balance text-3xl font-normal text-foreground md:text-4xl lg:text-5xl">
            Video calls and meet for all
          </h1>
          <p className="text-pretty text-base text-muted-foreground md:text-lg">
            Meeting Application provides video calling for collaboration and fun
            — no matter where you are.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            <Video className="mr-2 h-5 w-5" />
            Новая встреча
          </Button>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Введите код встречи или ссылку"
              className="w-full sm:w-64"
            />
            <Button variant="ghost" className="hidden sm:inline-flex">
              Присоединиться
            </Button>
          </div>
        </div>
        <Button variant="ghost" className="w-full sm:hidden">
          Присоединиться
        </Button>

        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Подробнее о Google Meet
          </a>
        </div>
      </div>
    </section>
  );
}
