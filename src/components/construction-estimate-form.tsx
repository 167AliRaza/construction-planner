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
  area_value: z.string().min(1, { message: "Area value is required." }),
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
});

type EstimateFormProps = {
  onEstimate: (data: any) => void;
};

export function ConstructionEstimateForm({ onEstimate }: EstimateFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area_value: "5",
      unit: "marla",
      marla_standard: "225 (Govt)",
      quality: "standard",
      city: "Faisalabad",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        area_value: parseFloat(values.area_value), // Convert to number
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

  const areaValueOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString()); // 1 to 20 for marla/sqft

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-sm bg-card w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Construction Estimate Planner</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid for form fields */}
          <FormField
            control={form.control}
            name="area_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Value</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area value" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areaValueOptions.map((value) => (
                      <SelectItem key={value} value={value}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Estimate
        </Button>
      </form>
    </Form>
  );
}