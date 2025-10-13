"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  area_value: z.coerce.number().min(1, { message: "Area value must be at least 1." }),
  unit: z.enum(["marla", "sqft"], { message: "Please select a valid unit." }),
  marla_standard: z.enum(["225 (Govt)", "272.25 (Lahore/old)"], {
    message: "Please select a valid marla standard.",
  }),
  quality: z.enum(["economy", "standard", "premium"], {
    message: "Please select a valid quality.",
  }),
  city: z.enum([
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Karachi",
    "Faisalabad",
    "Multan",
    "Other",
  ], { message: "Please select a valid city." }),
  overall_length: z.string().min(1, { message: "Overall length is required." }),
  overall_width: z.string().min(1, { message: "Overall width is required." }),
  bedrooms: z.coerce.number().min(1, { message: "Bedrooms must be at least 1." }).max(7, { message: "Bedrooms cannot exceed 7." }),
  bathrooms: z.coerce.number().min(1, { message: "Bathrooms must be at least 1." }).max(5, { message: "Bathrooms cannot exceed 5." }),
  kitchen_size: z.coerce.number().min(1, { message: "Kitchens must be at least 1." }).max(2, { message: "Kitchens cannot exceed 2." }),
  living_rooms: z.coerce.number().min(0, { message: "Living rooms must be at least 0." }).max(3, { message: "Living rooms cannot exceed 3." }),
  drawing_dining: z.coerce.number().min(0, { message: "Drawing/Dining must be 0 or 1." }).max(1, { message: "Drawing/Dining can be 0 or 1." }),
  garage: z.string().optional().default("not required"),
  floors: z.enum(["single story", "double story", "triple story"], {
    message: "Please select the number of floors.",
  }),
  style: z.string().optional().default("Pakistani style"),
});

type EstimateFormProps = {
  onEstimate: (data: any) => void;
};

export function ConstructionEstimateForm({ onEstimate }: EstimateFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area_value: 5,
      unit: "marla",
      marla_standard: "225 (Govt)",
      quality: "standard",
      city: "Faisalabad",
      overall_length: "50 ft",
      overall_width: "15 ft",
      bedrooms: 3,
      bathrooms: 2,
      kitchen_size: 1,
      living_rooms: 1,
      drawing_dining: 0,
      garage: "not required",
      floors: "single story",
      style: "Pakistani style",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        bedrooms: String(values.bedrooms),
        bathrooms: String(values.bathrooms),
        kitchen_size: String(values.kitchen_size),
        living_rooms: String(values.living_rooms),
        drawing_dining: String(values.drawing_dining),
      };

      const response = await fetch(
        "https://167aliraza-construction-planer.hf.space/estimate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch estimate.");
      }

      const data = await response.json();
      onEstimate(data);
      toast.success("Estimate generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card w-full max-h-[calc(100vh-100px)] overflow-y-auto"> {/* Removed max-w-4xl */}
        <h2 className="text-2xl font-semibold text-center mb-6">Construction Estimate Planner</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="area_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter area value"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value === "" ? "" : Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="marla">Marla</SelectItem>
                    <SelectItem value="sqft">Sqft</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marla_standard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marla Standard</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marla standard" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="225 (Govt)">225 (Govt)</SelectItem>
                    <SelectItem value="272.25 (Lahore/old)">272.25 (Lahore/old)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quality</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Lahore">Lahore</SelectItem>
                    <SelectItem value="Islamabad">Islamabad</SelectItem>
                    <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                    <SelectItem value="Karachi">Karachi</SelectItem>
                    <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                    <SelectItem value="Multan">Multan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overall_length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Length (e.g., 50 ft)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 50 ft" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overall_width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Width (e.g., 15 ft)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 15 ft" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Bedrooms</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of bedrooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Bathrooms</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of bathrooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kitchen_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Kitchens</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of kitchens" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="living_rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Living Rooms</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of living rooms" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[0, 1, 2, 3].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drawing_dining"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drawing/Dining</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Not Required</SelectItem>
                    <SelectItem value="1">Required</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="garage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garage (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., not required or for 2 cars" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Floors</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of floors" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single story">Single Story</SelectItem>
                    <SelectItem value="double story">Double Story</SelectItem>
                    <SelectItem value="triple story">Triple Story</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pakistani style, Modern" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Estimate
        </Button>
      </form>
    </Form>
  );
}