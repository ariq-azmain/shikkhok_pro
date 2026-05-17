const StatsSection = () => {
  return (
    <section className="py-24 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-center">
        <div>
          <h3 className="text-5xl font-black text-blue-500">10K+</h3>
          <p className="text-slate-400 mt-3">Teachers</p>
        </div>

        <div>
          <h3 className="text-5xl font-black text-green-500">50K+</h3>
          <p className="text-slate-400 mt-3">Questions Generated</p>
        </div>

        <div>
          <h3 className="text-5xl font-black text-yellow-500">500+</h3>
          <p className="text-slate-400 mt-3">Organizations</p>
        </div>

        <div>
          <h3 className="text-5xl font-black text-purple-500">99.9%</h3>
          <p className="text-slate-400 mt-3">Secure Infrastructure</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;