"use client";
import React from 'react';
import JobAdForm from '@/components/jobs/JobAdForm';

export default function CreateJobAdPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a new Job Ad</h1>
      <JobAdForm />
    </div>
  );
}
