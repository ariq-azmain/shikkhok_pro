const SocialFeedSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8">
              Social Learning Feed
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed">
              Browse public questions, engage with teachers,
              comment, share, and discover trending educational content.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-2xl">
                SSC Physics Creative Question
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl">
                Class 8 Math MCQ Set
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl">
                HSC ICT Model Test
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeedSection;