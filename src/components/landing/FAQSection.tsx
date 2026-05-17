import { faqData } from "@/constants/landing";
import SectionTitle from "./SectionTitle";

const FAQSection = () => {
  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything teachers ask before getting started."
        />

        <div className="space-y-6">
          {faqData.map((faq, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">
                {faq.question}
              </h3>

              <p className="text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;