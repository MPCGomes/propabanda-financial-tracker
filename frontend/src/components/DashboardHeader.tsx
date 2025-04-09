type DashboardHeader = {
  evolution?: "noDash" | "Dash";
  performance?: "noDash" | "Dash";
};

export default function DashboardHeader({
  evolution = "noDash",
  performance = "noDash",
}: DashboardHeader) {
  const baseClasses = "text-base text-[#282828] font-medium";

  const variants = {
    noDash: "",
    Dash: "underline decoration-[#FFA322] underline-offset-6 decoration-2",
  };

  return (
    <div className="flex gap-7">
      <a
        href="/dashboard-evolution"
        className={`${baseClasses} ${variants[evolution]}`}
      >
        Evolução
      </a>
      <a href="/dashboard-performance" className={`${baseClasses} ${variants[performance]}`}>
        Performance
      </a>
    </div>
  );
}
