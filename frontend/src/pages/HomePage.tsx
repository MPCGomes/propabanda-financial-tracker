type HomePageProps = {
  title: string;
};

export default function HomePage({ title }: HomePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
}
