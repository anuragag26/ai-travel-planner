"use client"

import React, { useState } from 'react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import router, { useRouter } from 'next/router';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { useRouter } from 'next/navigation';

import { formSchema } from "@/server/schemas";
import { generateTripPlan } from '@/server/ai';

import { Check, ChevronsUpDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { addDays, format, formatDate } from "date-fns"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"


import { CalendarIcon } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"



const activities = [
  {
    value: "food",
    label: "Food",
  },
  {
    value: "nature",
    label: "Nature",
  },
  {
    value: "hiking",
    label: "Hiking",
  },
  {
    value: "culture",
    label: "Culture",
  },
  {
    value: "history",
    label: "History",
  },
  {
    value: "art",
    label: "Art",
  },
]

export default function TravelPlannerForm() {
  const router = useRouter();

  const [currentlySelectedactivities, setCurrentlySelectedActivities] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          startDate: new Date(),
          endDate: new Date(),
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          const planId = await generateTripPlan(values);
          router.push(`/plan/${planId}`);
        }catch (error) {
          console.error(error);
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex gap-4">
      <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      form.setValue(
                        "endDate",
                        addDays(date ?? new Date(), 1)
                      );

                    }}
                    disabled={(date) =>
                      date < new Date() 
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The day you leave for your trip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      form.getValues("startDate")
                      ? addDays(form.getValues("startDate"),1) : field.value
                    }
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || 
                      date < addDays(form.getValues("startDate"),1)
                    }
                    initialFocus
                    defaultMonth={form.getValues("endDate")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The day you return from your trip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input 
                  type="number"
                   {...field}
                   onChange={(e) => {
                    field.onChange(Number(e.target.value));
                   }}
                   placeholder="Enter your Budget"
                    />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  The total amount of money you want to spend on your trip.
                </FormDescription>
              </FormItem>
            )}
          />

<FormField
          control={form.control}
          name="activities"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Activities</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      Selected Activities
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Activities..."
                    />
                    <CommandList>
                      <CommandEmpty>No Activity found.</CommandEmpty>
                      <CommandGroup>
                        {activities.map((activity) => (
                          <CommandItem
                            value={activity.label}
                            key={activity.value}
                            onSelect={() => {
                              if(currentlySelectedactivities.includes(activity.label)) {
                                setCurrentlySelectedActivities(
                                  currentlySelectedactivities.filter(
                                    (a) => a !== activity.label
                                  )
                                );

                                form.setValue(
                                  "activities",
                                  currentlySelectedactivities.filter(
                                    (a) => a !== activity.label
                                  )
                                );

                              } else {
                                setCurrentlySelectedActivities([...currentlySelectedactivities, activity.label,
                                ]);

                                form.setValue("activities", [
                                  ...currentlySelectedactivities,
                                  activity.label,
                                ]);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentlySelectedactivities.includes (
                                  activity.label
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {activity.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                These are the activities you want to do on your trip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination - Optional</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Destination" />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is the destination of yout trip.
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    );
}
