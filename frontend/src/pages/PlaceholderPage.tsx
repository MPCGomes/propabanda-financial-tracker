import PlaceholderBox from "../components/PlaceholderComponent";

type PlaceholderPageProps = {
  title: string;
};

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <PlaceholderBox text={`This is the ${title.toLowerCase()}.`} />
    </div>
  );
}
