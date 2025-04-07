import Button from "../components/Button";

type HomePageProps = {
  title: string;
};

export default function HomePage({ title }: HomePageProps) {
  return (
    <div className="">
      <Button text="Bom dia" variant="outlined"/>
    </div>
  );
}
