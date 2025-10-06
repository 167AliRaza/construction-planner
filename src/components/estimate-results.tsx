"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Design = {
  name: string;
  summary: string;
  best_for: string;
  note: string;
};

type RetrieverResult = {
  content: string;
  metadata: {
    URL_1: string;
    URL_2: string;
  };
};

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
    designs: Design[];
  };
  retriever_results: RetrieverResult[];
};

type EstimateResultsProps = {
  data: EstimateResultData;
};

export function EstimateResults({ data }: EstimateResultsProps) {
  const { cost, materials, plan, designs } = data.result;
  const { retriever_results } = data;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-PK").format(value);

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Construction Estimate Details</h2>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Covered Area (sqft)</TableCell>
                <TableCell>{formatNumber(cost.covered_sqft)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Grey Structure Cost</TableCell>
                <TableCell>{formatCurrency(cost.grey_cost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Finishing Cost</TableCell>
                <TableCell>{formatCurrency(cost.finishing_cost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Estimated Cost</TableCell>
                <TableCell className="text-lg font-bold">{formatCurrency(cost.total_cost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">City Factor</TableCell>
                <TableCell>{cost.city_factor}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Materials Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Materials Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(materials).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell className="text-right">
                    {key === "Materials Cost (PKR)" ? formatCurrency(value as number) : formatNumber(value as number)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Details (Approx. Area in sqft)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plan).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <span className="font-medium">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Design Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{design.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                  <p><strong>Summary:</strong> {design.summary}</p>
                  <p><strong>Best For:</strong> {design.best_for}</p>
                  <p><strong>Note:</strong> {design.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design Images */}
      {retriever_results && retriever_results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Design Visualizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {retriever_results.map((result, resultIndex) => (
                <div key={resultIndex} className="space-y-4">
                  {result.metadata.URL_1 && (
                    <div className="w-full flex flex-col items-center space-y-2">
                      <div className="relative w-full h-[400px] overflow-hidden rounded-md border">
                        <Image
                          src={result.metadata.URL_1}
                          alt={result.content}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <a href={result.metadata.URL_1} download className="w-full">
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" /> Download Image 1
                        </Button>
                      </a>
                    </div>
                  )}
                  {result.metadata.URL_2 && (
                    <div className="w-full flex flex-col items-center space-y-2">
                      <div className="relative w-full h-[400px] overflow-hidden rounded-md border">
                        <Image
                          src={result.metadata.URL_2}
                          alt={result.content}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <a href={result.metadata.URL_2} download className="w-full">
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" /> Download Image 2
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}