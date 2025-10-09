"use client";

import { useState } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ConstructionEstimateForm } from "@/components/construction-estimate-form";
import { EstimateResults } from "@/components/estimate-results";
import { Toaster } from "@/components/ui/sonner";

type EstimateResultData = {
  result: {
    cost: {
      covered_sqft: number;
      grey_cost: number;
      finishing_cost: number;
      total_cost: number;
      city_factor: number;
    };
    materials: {
      "Bricks (units)": number;
      "Cement (50kg bags)": number;
      "Steel (kg)": number;
      "Sand (cft)": number;
      "Crush (cft)": number;
      "Electrical wiring (m)": number;
      "Plumbing PVC (m)": number;
      "Paint (sqft)": number;
      "Materials Cost (PKR)": number;
    };
    plan: {
      Bedrooms: string;
      "Lounge / Living": number;
      Kitchen: number;
      "Bathrooms (combined)": number;
      "Circulation / Stairs": number;
      "Store / Laundry": number;
      "Wardrobes / Built-ins": number;
    };
    designs: {
      name: string;
      summary: string;
      best_for: string;
      note: string;
    }[];
  };
  image1?: string; // New image field
  image2?: string; // New image field
};

export default function Home() {
  const [estimateResult, setEstimateResult] = useState<EstimateResultData | null>(null);

  return (
    <div className="flex flex-col items-center h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-background text-foreground overflow-hidden">
      <main className="w-full max-w-4xl flex flex-col gap-8 items-center h-full justify-center">
        {!estimateResult ? (
          <ConstructionEstimateForm onEstimate={setEstimateResult} />
        ) : (
          <EstimateResults data={estimateResult} />
        )}
      </main>
      <MadeWithDyad />
      <Toaster />
    </div>
  );
}