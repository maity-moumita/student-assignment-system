import { ClipboardList } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="glass rounded-2xl p-12 text-center">

      <div className="w-16 h-16 rounded-2xl bg-[var(--teal-light)] flex items-center justify-center mx-auto">
        <ClipboardList
          size={30}
          className="text-[var(--teal)]"
        />
      </div>

      <h3 className="font-bold text-lg mt-5">
        No assignments found
      </h3>

      <p className="text-sm text-[var(--muted)] mt-2">
        Try changing your search or filters.
      </p>

    </div>
  );
}