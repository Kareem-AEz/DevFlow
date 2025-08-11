import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner variant="default" size="lg" text="Loading..." />
    </div>
  );
}
