"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { Locale } from "date-fns";
import { Separator } from "./separator";
import { TimePickerInput } from "./time-picker-input";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  displayFormat?: string;
  locale?: Locale;
  placeholder?: string;
  className?: string;
  hideTime?: boolean;
  hideDate?: boolean;
  lessThanToday?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  displayFormat = "PPP p",
  locale,
  placeholder,
  hideTime = false,
  hideDate = false,
  lessThanToday = false,
  className,
}: DateTimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex justify-start font-normal w-full", className)}
        >
          <CalendarIcon className="mr-1 h-4 w-4" />
          <p className={cn(date ? "text-sm" : "text-sm text-gray-500")}>
            {date ? format(date, displayFormat, { locale }) : placeholder}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!hideDate && (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={locale}
            showYearSwitcher
            disabled={(date: Date) =>
              lessThanToday ? date > new Date() : false
            }
          />
        )}
        {!hideDate && <Separator />}
        {!hideTime && (
          <div className="flex items-center justify-center gap-2 my-2 px-2">
            <label
              htmlFor="datetime-picker-hour-input"
              className="cursor-pointer"
            >
              <Clock className="mr-2 h-4 w-4" />
            </label>
            <TimePickerInput
              picker="hours"
              date={date}
              id="datetime-picker-hour-input"
              setDate={setDate}
              ref={hourRef}
              onRightFocus={() => minuteRef?.current?.focus()}
            />
            :
            <TimePickerInput
              picker="minutes"
              date={date}
              setDate={setDate}
              ref={minuteRef}
              onLeftFocus={() => hourRef?.current?.focus()}
              onRightFocus={() => secondRef?.current?.focus()}
            />
            :
            <TimePickerInput
              picker="seconds"
              date={date}
              setDate={setDate}
              ref={secondRef}
              onLeftFocus={() => minuteRef?.current?.focus()}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
