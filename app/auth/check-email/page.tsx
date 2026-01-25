export const dynamic = "force-dynamic";

import CheckEmailClient from "./CheckEmailClient";

type SearchParams = {
  email?: string | string[];
};

type PageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

function normalizeEmail(input: string | string[] | undefined) {
  if (!input) return "";
  return (Array.isArray(input) ? input[0] : input).trim();
}

export default async function Page(props: PageProps) {
  const resolved =
    props.searchParams && typeof (props.searchParams as any).then === "function"
      ? await (props.searchParams as Promise<SearchParams>)
      : (props.searchParams as SearchParams | undefined);

  const email = normalizeEmail(resolved?.email);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          We sent a confirmation link to{" "}
          <span className="font-medium text-slate-900">
            {email || "your email address"}
          </span>
          . Open it to complete sign in.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-700">
            If you don’t see the email, check Spam/Junk and try again.
          </p>

          {/* ✅ This is the red marked area */}
          <div className="mt-4">
            <CheckEmailClient email={email} />
          </div>
        </div>
      </section>
    </main>
  );
}
