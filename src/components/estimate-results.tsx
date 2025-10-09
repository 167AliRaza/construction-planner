"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/download-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components

type Design = {
  name: string;
  summary: string;
  best_for: string;
  note: string;
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
  image1?: string; // New image field
  image2?: string; // New image field
};

type EstimateResultsProps = {
  data: EstimateResultData;
};

export function EstimateResults({ data }: EstimateResultsProps) {
  const { cost, materials, plan, designs } = data.result;
  const { image1, image2 } = data; // Destructure new image fields

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
    <div className="space-y-8 p-6 w-full max-w-4xl">
      <h2 className="text-3xl font-bold text-center mb-8">Construction Estimate Details</h2>

      <Tabs defaultValue="cost" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="visuals">Visuals</TabsTrigger>
        </TabsList>

        <TabsContent value="cost" className="mt-4">
          <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
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
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
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
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
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
        </TabsContent>

        <TabsContent value="designs" className="mt-4">
          <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
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
        </TabsContent>

        <TabsContent value="visuals" className="mt-4">
          {(image1 || image2) ? (
            <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
              <CardHeader>
                <CardTitle>Design Visualizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {image1 && (
                    <div className="w-full flex flex-col items-center space-y-2">
                      <div className="relative w-full h-[400px] overflow-hidden rounded-md border">
                        <Image
                          src={image1}
                          alt="Design Image 1"
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadImage(image1, `design_image_1.webp`)}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Image 1
                      </Button>
                    </div>
                  )}
                  {image2 && (
                    <div className="w-full flex flex-col items-center space-y-2">
                      <div className="relative w-full h-[400px] overflow-hidden rounded-md border">
                        <Image
                          src={image2}
                          alt="Design Image 2"
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadImage(image2, `design_image_2.webp`)}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Image 2
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-h-[calc(100vh-250px)] overflow-y-auto">
              <CardContent className="p-6 text-center text-muted-foreground">
                No visualizations available for this estimate.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}