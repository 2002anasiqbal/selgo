"use client";
import React from 'react';
import PropertyAdForm from '@/components/property/PropertyAdForm';

export default function CreatePropertyAdPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a new Property Ad</h1>
      <PropertyAdForm />
    </div>
  );
}
