interface Props {
  title: string;
  subtitle: string;
}

const SectionTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-5">{title}</h2>
      <p className="text-slate-400 text-lg">{subtitle}</p>
    </div>
  );
};

export default SectionTitle;