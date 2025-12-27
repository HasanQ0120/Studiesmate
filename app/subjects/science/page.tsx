import { redirect } from "next/navigation";

export default function ScienceRedirectPage() {
  redirect("/subjects/science/chapters");
}
