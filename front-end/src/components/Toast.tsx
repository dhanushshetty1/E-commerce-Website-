import { useEffect, useState } from "react";

export default function Toast({ message, showFor = 1800 }: { message: string; showFor?: number }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), showFor);
    return () => clearTimeout(t);
  }, [showFor]);
  if (!open) return null;
  return <div className="toast">{message}</div>;
}
