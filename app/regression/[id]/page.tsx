import React from "react";
import { RegressionDetailView } from "@/components/views/RegressionDetailView";

export const dynamic = "force-dynamic";

export default function RegressionDynamicPage({ params }: { params: { id: string } }) {
  return <RegressionDetailView deployId={params.id || "184"} />;
}
