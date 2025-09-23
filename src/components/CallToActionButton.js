import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToActionButton({
  children = 'Start Free Trial',
}) {
  return (
    <Link href="/upload" className="w-full sm:w-auto">
      <Button
        variant="hero"
        className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto shadow-soft hover:shadow-glow h-12 sm:h-14 flex items-center justify-center rounded-lg font-semibold"
      >
        <ArrowRight className="h-4 w-4" />
        {children}
      </Button>
    </Link>
  );
}
