import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StudiesMateUserMeta = {
  studentName?: string;
  studentClass?: string;
  parentEmail?: string;
  phone?: string;
  connect_code?: string;
};

function generateConnectCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `SM-${digits}`;
}

export async function signUpParentAccount(params: {
  parentEmail: string;
  password: string;
  studentName: string;
  studentClass: string;
  phone?: string;
}) {
  const { parentEmail, password, studentName, studentClass, phone } = params;
  const connectCode = generateConnectCode();

  return supabase.auth.signUp({
    email: parentEmail.trim().toLowerCase(),
    password: password.trim(),
    options: {
      emailRedirectTo: 'https://studiesmate-web.vercel.app/dashboard',
      data: {
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        parentEmail: parentEmail.trim().toLowerCase(),
        connect_code: connectCode,
        ...(phone?.trim() ? { phone: phone.trim() } : {}),
      } satisfies StudiesMateUserMeta,
    },
  });
}

export async function signInParentAccount(params: {
  parentEmail: string;
  password: string;
}) {
  const { parentEmail, password } = params;

  return supabase.auth.signInWithPassword({
    email: parentEmail.trim().toLowerCase(),
    password: password.trim(),
  });
}

export async function signOutAccount() {
  return supabase.auth.signOut();
}
