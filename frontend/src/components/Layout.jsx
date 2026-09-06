import React from 'react';
import Navbar from './Navbar';
import LeftProfileCard from './LeftProfileCard';
import RightSuggestedCard from './RightSuggestedCard';

export default function Layout({ children, showColumns = true, fullWidth = false }) {
  return (
    <div className="min-h-screen bg-[#f4f2ee] flex flex-col">
      <Navbar />

      {/* Main Container below 56px fixed navbar */}
      <main className="flex-1 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {fullWidth ? (
            /* Full-width mode for detailed profile pages or hero views */
            <div className="w-full">{children}</div>
          ) : showColumns ? (
            /* 3-Column LinkedIn Feed Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column (narrow, 3 cols) */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-18">
                <LeftProfileCard />
              </aside>

              {/* Center Column (wide, 6 cols on desktop, 12 on mobile) */}
              <section className="lg:col-span-6 min-w-0 space-y-4">
                {children}
              </section>

              {/* Right Column (narrow, 3 cols) */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-18">
                <RightSuggestedCard />
              </aside>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">{children}</div>
          )}
        </div>
      </main>
    </div>
  );
}
