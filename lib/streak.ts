import { supabase } from "@/lib/auth";

export async function updateStreak(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  let { data: profile } = await supabase
    .from("profiles")
    .select("current_streak, last_active_date")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").upsert({
      id: userId,
      current_streak: 1,
      last_active_date: today,
    }, { onConflict: "id" });
    return;
  }

  const lastActive = profile.last_active_date;
  let newStreak = profile.current_streak || 0;

  if (lastActive === today) {
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastActive === yesterdayStr) {
    newStreak = newStreak + 1;
  } else {
    newStreak = 1;
  }

  await supabase
    .from("profiles")
    .update({ current_streak: newStreak, last_active_date: today })
    .eq("id", userId);
}
