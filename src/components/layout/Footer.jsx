import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <section className="py-4 px-4">
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-6 md:py-10">
        <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Image
              src="/logo.svg"
              alt="Reddit Agency Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <p className="font-bold text-xl text-black">Reddit Agency</p>
          </div>
          <p className="text-sm text-base-content/80 leading-relaxed">
            Turn Reddit Traffic Into Customers
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1 text-center">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Links
          </span>
          <Link
            href="/#services"
            className="text-sm hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            href="/#pricing"
            className="text-sm hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#results"
            className="text-sm hover:text-primary transition-colors"
          >
            Results
          </Link>
          <a
            href="https://docs.google.com/document/d/e/2PACX-1vST8ZGrXlWxZR17MRGOgfAJj2lHhRqb3__-WxOZNSezEfA-i9TgBkqAWvoYFqrtU1oC4RKaU9L6mJZM/pub"
            className="text-sm hover:text-primary transition-colors"
            title="Free Guide: How to Dominate on Reddit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Free Reddit Guide
          </a>
        </div>

        <div className="flex flex-col gap-3 flex-1 text-center md:text-right">
          <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
            Connect
          </span>
          <a
            href="https://x.com/tech_nurgaliyev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            X (Twitter)
          </a>
          <a
            href="https://mvpagency.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-primary transition-colors"
          >
            MVP Agency
          </a>
        </div>
      </div>
    </section>
  );
}
