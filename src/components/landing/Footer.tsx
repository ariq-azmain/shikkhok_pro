const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold">Shikkhok Pro</h2>

          <p className="text-slate-400 mt-3">
            AI Powered Education Platform for Bangladesh.
          </p>
        </div>

        <div className="text-slate-400">
          © 2026 Shikkhok Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;