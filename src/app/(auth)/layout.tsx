import { AtmosphericBackground } from "@/components/shared/AtmosphericBackground";
import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AtmosphericBackground />

      {/* Nav minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <FileSearch className="h-3.5 w-3.5 fill-white text-white" />
          </div>
          <span className="font-heading text-[15px] font-700">
            Contract<span className="text-accent">Lens</span>
          </span>
        </Link>
      </nav>

      <div className="relative z-10 flex w-full items-center justify-center px-6 pt-14">
        {children}
      </div>
    </div>
  );
}
