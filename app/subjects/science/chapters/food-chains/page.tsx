"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function FoodChainsPage() {
  return (
    <DashboardLayout selectedSubject="science" onSubjectChange={() => {}}>
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] text-center px-6">
        <div>
          <p className="text-lg font-bold text-[#111827]">This chapter is coming soon.</p>
          <p className="mt-2 text-sm text-[#6B7280]">Check back after Beta launches more content.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
