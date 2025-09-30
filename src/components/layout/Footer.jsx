import Link from "next/link";
import { NotebookPen, Upload, Home } from "lucide-react";

export default function Footer() {
  return (
    <section className="py-4 px-4 bg-[#F3F4EF] border-t border-gray-200">
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-6 md:py-10">
        <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <NotebookPen className="h-8 w-8 text-slate-900" />
            <p className="font-bold text-xl text-slate-900">MissNotes</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Turn meeting recordings into actionable notes in minutes. No setup,
            no distractions.
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1 text-center">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Product
          </span>
          <Link
            href="/#pricing"
            className="text-sm hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#features"
            className="text-sm hover:text-primary transition-colors"
          >
            Features
          </Link>
          <a
            href="/api/create-portal-session"
            className="text-sm hover:text-primary transition-colors"
          >
            Manage Subscription
          </a>
          <a
            href="mailto:nurgasab@gmail.com"
            className="text-sm hover:text-primary transition-colors"
          >
            Contact Support
          </a>
        </div>

        <div className="flex flex-col gap-3 flex-1 text-center md:text-right">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Resources
          </span>

          <Link
            href="/templates/meeting-notes-template"
            className="text-sm hover:text-primary transition-colors"
          >
            Templates
          </Link>
          <div className="text-xs text-slate-500 mt-4 md:mt-auto">
            © 2025 MissNotes. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
