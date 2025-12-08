"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chat } from "../components/Chat";

// Mock data (replace with Supabase later)
const products = [
  { id: "1", name: "Flexi Personal Loan", bank: "HDFC", rate_apr: 11.5, min_income: 30000, min_credit_score: 700 },
  { id: "2", name: "Smart Home Loan", bank: "ICICI", rate_apr: 8.2, min_income: 45000, min_credit_score: 720 },
  { id: "3", name: "Education Loan Plus", bank: "SBI", rate_apr: 9.7, min_income: 25000, min_credit_score: 680 },
  { id: "4", name: "Vehicle Loan Advantage", bank: "Axis", rate_apr: 10.9, min_income: 28000, min_credit_score: 650 },
  { id: "5", name: "Credit Line Express", bank: "Kotak", rate_apr: 13.5, min_income: 35000, min_credit_score: 700 },
];

export default function AllProductsPage() {
  const [search, setSearch] = useState("");
  const [apr, setApr] = useState(20); // Max APR
  const [minIncome, setMinIncome] = useState(20000);
  const [creditScore, setCreditScore] = useState(600);

  const filtered = products.filter(
    (p) =>
      p.rate_apr <= apr &&
      p.min_income >= minIncome &&
      p.min_credit_score >= creditScore &&
      p.bank.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">All Loan Products</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* Bank Search */}
        <input
          type="text"
          placeholder="Search by Bank"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* APR Slider */}
        <div className="flex flex-col items-center">
          <label>Max APR: {apr}%</label>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={apr}
            onChange={(e) => setApr(+e.target.value)}
            className="w-48"
          />
        </div>

        {/* Minimum Income Slider */}
        <div className="flex flex-col items-center">
          <label>Min Income: ₹{minIncome}</label>
          <input
            type="range"
            min={20000}
            max={50000}
            step={1000}
            value={minIncome}
            onChange={(e) => setMinIncome(+e.target.value)}
            className="w-48"
          />
        </div>

        {/* Minimum Credit Score Slider */}
        <div className="flex flex-col items-center">
          <label>Min Credit Score: {creditScore}</label>
          <input
            type="range"
            min={600}
            max={800}
            step={10}
            value={creditScore}
            onChange={(e) => setCreditScore(+e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <Card key={product.id} className="p-4 rounded-2xl shadow-md hover:shadow-lg transition border">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Bank: {product.bank}</p>
              <p>APR: {product.rate_apr}%</p>
              <p>Min Income: ₹{product.min_income}</p>
              <p>Credit Score: {product.min_credit_score}</p>
              <div className="flex gap-2 flex-wrap">
                {product.rate_apr < 10 && <Badge>Low APR</Badge>}
                {product.min_income < 35000 && <Badge>Low Income Eligible</Badge>}
              </div>
             
           <Chat product={product}/>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center col-span-full">No products match your filters.</p>}
      </div>
    </div>
  );
}
