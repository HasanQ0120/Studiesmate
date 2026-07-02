export const dynamic = "force-dynamic";

import FeedbackAdminGate from "@/components/FeedbackAdminGate";
import FeedbackAdminPage from "@/app/dashboard/feedback/page";

export default function Page() {
  return (
    <FeedbackAdminGate title="Admin access" subtitle="Enter the password to continue.">
      <FeedbackAdminPage />
    </FeedbackAdminGate>
  );
}
