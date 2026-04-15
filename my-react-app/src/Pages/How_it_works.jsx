export default function HowItWorks() {
  return (
    <div className="min-h-screen py-24 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        How It Works
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
        <StepCard step="01" title="Enter Data" desc="Add your details" />
        <StepCard step="02" title="AI Analysis" desc="System analyzes data" />
        <StepCard step="03" title="Get Result" desc="See eligibility" />
      </div>
    </div>
  );
}