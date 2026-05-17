import SectionTitle from "./SectionTitle";
import {
  FaRobot,
  FaLock,
  FaFilePdf,
  FaUsers,
} from "react-icons/fa";

const features = [
  {
    icon: FaRobot,
    title: "AI Question Generator",
    description:
      "Generate smart question papers instantly with custom prompts.",
  },
  {
    icon: FaLock,
    title: "Question Leak Protection",
    description:
      "Private question papers remain protected with organization-level security.",
  },
  {
    icon: FaFilePdf,
    title: "PDF & Image Export",
    description:
      "Export beautifully formatted question papers in seconds.",
  },
  {
    icon: FaUsers,
    title: "Teacher Collaboration",
    description:
      "Teachers can collaborate inside organizations securely.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Everything Teachers Need"
          subtitle="Built specifically for Bangladesh education system."
        />

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-3xl p-8"
              >
                <Icon className="text-4xl text-blue-500 mb-6" />

                <h3 className="text-2xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;