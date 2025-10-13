"use client";

import React from 'react';
import { ThemeToggle } from './theme-toggle'; // Import the ThemeToggle component

export function PageHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background p-4 shadow-md border-b border-border flex items-center justify-between">
      <h1 className="text-2xl font-bold text-center flex-grow">Construction Estimate Planner</h1>
      <ThemeToggle /> {/* Add the ThemeToggle here */}
    </header>
  );
}