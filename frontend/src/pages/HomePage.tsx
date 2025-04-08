import FloatingButton from "../components/AddButton";

type HomePageProps = {
  title: string;
};

export default function HomePage({ title }: HomePageProps) {
  return (
    <div className="">
      <FloatingButton/>
    </div>
  );
}
