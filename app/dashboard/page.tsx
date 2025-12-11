"use client";

import { useRouter } from "next/navigation";
import { Calculator, BookOpen, Languages, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const subjects = [
    {
      id: "maths",
      title: "Maths",
      desc: "Numbers, addition, subtraction, and shapes.",
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      href: "/subjects/maths",
    },
    {
      id: "english",
      title: "English",
      desc: "Reading stories, grammar, and writing.",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      href: "/subjects/english",
    },
    {
      id: "urdu",
      title: "Urdu",
      desc: "Harf-e-Tahajji, reading, and vocabulary.",
      icon: <Languages className="w-6 h-6 text-blue-600" />,
      href: "/subjects/urdu",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome 👋
        </h1>
        <p className="text-gray-600 mb-10">
          Choose a subject to begin your learning.
        </p>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 
              hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  {subject.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {subject.title}
                </h3>
              </div>

              <p className="text-gray-600 text-sm mb-6">{subject.desc}</p>

              {/* BUTTON — text color fixed */}
              <button
                onClick={() => router.push(subject.href)}
                className="
                  inline-flex items-center justify-center gap-2 
                  px-4 py-2 rounded-full 
                  border border-blue-400 
                  text-blue-600 font-medium text-sm
                  hover:bg-blue-50 hover:text-blue-700 
                  transition-all duration-200
                "
              >
                Open {subject.title}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Weekly Goal Box */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-blue-900">Weekly Goal</h3>
          <p className="text-blue-800 text-sm mb-3">
            You've completed 3/5 lessons this week!
          </p>

          <div className="w-full h-3 bg-white rounded-full overflow-hidden">
            <div className="h-full w-[60%] bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
