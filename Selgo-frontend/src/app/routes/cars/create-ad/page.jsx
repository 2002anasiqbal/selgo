"use client";
import React from 'react';
import CarAdForm from '@/components/cars/CarAdForm';

export default function CreateCarAdPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a new Car Ad</h1>
      <CarAdForm />
    </div>
  );
}
