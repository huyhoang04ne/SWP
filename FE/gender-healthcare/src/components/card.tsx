import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border bg-white p-6 shadow">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}
