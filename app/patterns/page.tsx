import { redirect } from "next/navigation";
import { DEFAULT_FLAVOR } from "@/lib/patterns";

/**
 * /patterns has no content of its own — every listing belongs to a flavour, so
 * the bare URL forwards to the default one rather than becoming a third index
 * that duplicates the other two and splits their search results.
 */
export default function PatternsPage() {
  redirect(`/patterns/${DEFAULT_FLAVOR}`);
}
