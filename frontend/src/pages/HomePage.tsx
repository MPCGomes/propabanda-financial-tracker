import Header from "../components/Header";

type HomePageProps = {
  title: string;
};

export default function HomePage({ title }: HomePageProps) {
  return (
    <div className="">
      <Header clients="active"  dashboard="active" />
    </div>
  );
}
