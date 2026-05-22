"use client";

interface WelcomeScreenProps {
  name: string;
  onContinue: () => void;
}

export default function WelcomeScreen({ name, onContinue }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B2B5A] px-6">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Welcome, {name}! 👋
        </h1>
        <p className="mt-6 text-base leading-8 text-white/80 md:text-lg">
          You have just joined the StudiesMate family. We are proud to have you here.
          Your learning journey starts today — one small step at a time.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-[#F97316] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#EA580C] hover:-translate-y-0.5 active:translate-y-0"
        >
          Go to Dashboard →
        </button>

        <div className="mt-5">
          <a
            href="https://chat.whatsapp.com/BgG4sUTHa1z8UXX7n2sKGn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/60 transition-colors hover:text-white/90"
          >
            Join our WhatsApp Community →
          </a>
        </div>
      </div>
    </div>
  );
}
