import Link from "next/link";

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Shikkhok Pro
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#faq">FAQ</a>
        </nav>

        <button className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Navbar;