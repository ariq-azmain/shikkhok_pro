import Image from "next/image";
import SectionTitle from "./SectionTitle";

const AISection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="AI Built for Bangladesh Curriculum"
          subtitle="NCTB-focused AI generation engine."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
            alt="AI"
            width={700}
            height={700}
            className="rounded-3xl"
          />

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-3">
                Curriculum Aware
              </h3>

              <p className="text-slate-400">
                AI understands SSC, HSC, and school curriculum.
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold mb-3">
                Custom Prompt Support
              </h3>

              <p className="text-slate-400">
                Teachers can fully customize question generation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;