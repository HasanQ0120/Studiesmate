"use client";

interface WelcomeScreenProps {
  name: string;
  onContinue: () => void;
}

export default function WelcomeScreen({ name, onContinue }: WelcomeScreenProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-[#0B2B5A] md:text-5xl">
          Welcome, {name}! 👋
        </h1>
        <p className="mt-6 text-base leading-8 text-slate-700 md:text-lg">
          You have just joined the StudiesMate family. We are proud to have you here.
          Your learning journey starts today — one small step at a time.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-xl bg-[#0B2B5A] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#0A2550] hover:-translate-y-0.5 active:translate-y-0"
          >
            Go to Dashboard →
          </button>

          <a
            href="https://chat.whatsapp.com/H8q5PBchpRNC4TWIeWp49I"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-[#0B2B5A] px-8 py-4 text-base font-semibold text-[#0B2B5A] transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0"
          >
            Join WhatsApp Community →
          </a>
        </div>
      </div>
    </div>
  );
}
