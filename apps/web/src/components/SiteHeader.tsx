import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-extrabold text-brand-600">
          Holiday<span className="text-sun-500">Jug</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/holidays" className="hover:text-brand-600">
            Holidays
          </Link>
          <Link href="/destinations" className="hover:text-brand-600">
            Destinations
          </Link>
          <Link href="/deals" className="hover:text-brand-600">
            Late Deals
          </Link>
          <Link href="/help" className="hover:text-brand-600">
            Help
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
          <Link
            href="/holidays"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}
