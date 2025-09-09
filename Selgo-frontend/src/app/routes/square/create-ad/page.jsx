"use client";
import React from 'react';
import SquareAdForm from '@/components/square/SquareAdForm';

export default function CreateSquareAdPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a new Square Ad</h1>
      <SquareAdForm />
    </div>
  );
}
