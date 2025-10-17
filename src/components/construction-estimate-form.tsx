"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
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
  area_value: z.coerce.number().min(3, { message: "Area value must be at least 3." }),
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
  bedrooms: z.coerce.number().min(1, { message: "Bedrooms must be at least 1." }),
  bathrooms: z.coerce.number().min(1, { message: "Bathrooms must be at least 1." }),
  kitchen_size: z.coerce.number().min(1, { message: "Kitchens must be at least 1." }).max(2, { message: "Kitchens cannot exceed 2." }),
  living_rooms: z.coerce.number().min(0, { message: "Living rooms must be at least 0." }).max(3, { message: "Living rooms cannot exceed 3." }),
  drawing_dining: z.coerce.number().min(0, { message: "Drawing/Dining must be 0 or 1." }).max(1, { message: "Drawing/Dining can be 0 or 1." }),
  garage: z.string().default("Required"),
  floors: z.coerce
    .number()
    .min(1, { message: "Floors must be at least 1." })
    .max(3, { message: "Floors cannot exceed 3." }),
  style: z.string().default("Pakistai style"),
});

type EstimateFormProps = {
  onEstimate: (data: any) => void;
};

export function ConstructionEstimateForm({ onEstimate }: EstimateFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const resolver = zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver,
    defaultValues: {
      area_value: 5,
      unit: "marla",
      marla_standard: "225 (Govt)",
      quality: "standard",
      city: "Faisalabad",
      overall_length: "50",
      overall_width: "15",
      bedrooms: 2,
      bathrooms: 2,
      kitchen_size: 1,
      living_rooms: 1,
      drawing_dining: 0,
      garage: "Required",
      floors: 1,
      style: "Pakistai style",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card w-full">
        {/* Removed the h2 title from here */}

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
                    min={3}
                    placeholder="Enter area value"
                    {...field}
                    onChange={(e) => {
                      const valueString = e.target.value;
                      if (valueString === "") {
                        field.onChange("");
                      } else {
                        const numericValue = Number(valueString);
                        const clampedValue = numericValue < 3 ? 3 : numericValue;
                        field.onChange(clampedValue);
                      }

                      // Derive bedrooms and bathrooms in real-time
                      const areaForCalculation = valueString === "" ? 3 : Math.max(3, Number(valueString));
                      const derivedRooms = Math.max(1, Math.floor(areaForCalculation * 0.5));
                      form.setValue("bedrooms", derivedRooms, { shouldDirty: true, shouldValidate: true });
                      form.setValue("bathrooms", derivedRooms, { shouldDirty: true, shouldValidate: true });

                      // Enforce garage always Required
                      form.setValue("garage", "Required", { shouldDirty: true, shouldValidate: true });

                      // living rooms: 0 when area <= 3, else 1
                      const livingRooms = areaForCalculation <= 3 ? 0 : 1;
                      form.setValue("living_rooms", livingRooms, { shouldDirty: true, shouldValidate: true });

                      // Prefill overall width/length based on marla presets while keeping inputs editable
                      const marlaDimensions: Record<number, { width: string; length: string }> = {
                        3: { width: "18", length: "37.5" },
                        4: { width: "25", length: "36" },
                        5: { width: "25", length: "45" },
                        6: { width: "30", length: "45" },
                        7: { width: "35", length: "45" },
                        8: { width: "30", length: "60" },
                        9: { width: "35", length: "58" },
                        10: { width: "35", length: "65" },
                      };
                      if (Number.isInteger(areaForCalculation) && marlaDimensions[areaForCalculation as 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10]) {
                        const preset = marlaDimensions[areaForCalculation as 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10];
                        form.setValue("overall_width", preset.width, { shouldDirty: true, shouldValidate: true });
                        form.setValue("overall_length", preset.length, { shouldDirty: true, shouldValidate: true });
                      }
                    }}
                    onBlur={(e) => {
                      const valueString = e.target.value;
                      if (valueString === "") {
                        field.onChange(3);
                        const derivedRooms = Math.max(1, Math.floor(3 * 0.5));
                        form.setValue("bedrooms", derivedRooms, { shouldDirty: true, shouldValidate: true });
                        form.setValue("bathrooms", derivedRooms, { shouldDirty: true, shouldValidate: true });
                        form.setValue("garage", "Required", { shouldDirty: true, shouldValidate: true });
                        form.setValue("living_rooms", 0, { shouldDirty: true, shouldValidate: true });
                        // Apply 3 marla default dimensions on empty -> 3
                        form.setValue("overall_width", "18", { shouldDirty: true, shouldValidate: true });
                        form.setValue("overall_length", "37.5", { shouldDirty: true, shouldValidate: true });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
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
                <Select onValueChange={field.onChange} value={field.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="marla">Marla</SelectItem>
                    {/* <SelectItem value="sqft">Sqft</SelectItem> */}
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
                <Select onValueChange={field.onChange} value={field.value as string}>
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
                <Select onValueChange={field.onChange} value={field.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectItem value="economy">Economy</SelectItem> */}
                    <SelectItem value="standard">Standard</SelectItem>
                    {/* <SelectItem value="premium">Premium</SelectItem> */}
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
                <Select onValueChange={field.onChange} value={field.value as string}>
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
                <FormLabel>Overall Length (e.g., 50 )</FormLabel>
                <FormControl>
                  <Input placeholder="in feets" {...field} type="number" min={1}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                        
                      }
                    }}required />
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
                <FormLabel>Overall Width (e.g., 15 )</FormLabel>
                <FormControl>
                  <Input
                    placeholder="in feets"
                    {...field}
                    type="number"
                    min={1}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}required
                  />
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
                <FormControl>
                  <Input type="number" value={String(field.value)} readOnly />
                </FormControl>
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
                <FormControl>
                  <Input type="number" value={String(field.value)} readOnly />
                </FormControl>
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
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled>
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
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled>
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
                    {/* <SelectItem value="0">Not Required</SelectItem> */}
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
                <FormLabel>Garage</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., not required or for 2 cars" {...field} readOnly />
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
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of floors" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1].map((num) => (
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
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pakistani style, Modern" {...field} readOnly />
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