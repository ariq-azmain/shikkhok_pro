import SectionTitle from "./SectionTitle";

const SecuritySection = () => {
  return (
    <section
      id="security"
      className="py-32 px-6 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          title="Built with Security First"
          subtitle="Question leak prevention is a core priority."
        />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4">
              Private Access Control
            </h3>

            <p className="text-slate-400">
              Only authorized teachers can access protected questions.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4">
              Organization Isolation
            </h3>

            <p className="text-slate-400">
              School question banks stay isolated from outsiders.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4">
              Encrypted Storage
            </h3>

            <p className="text-slate-400">
              Sensitive data remains encrypted and protected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;