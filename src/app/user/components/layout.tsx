'use client';

import React from 'react';
import LeftSide from './leftSide';

export default function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <LeftSide />
        <main className="lg:col-span-9">
          <div className="bg-white  rounded-lg p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
