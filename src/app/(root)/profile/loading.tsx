import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner variant="skeleton" text="Loading profile..." />
    </div>
  );
}
