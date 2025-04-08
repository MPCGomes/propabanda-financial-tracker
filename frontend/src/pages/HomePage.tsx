import Client from "../components/Client";

type HomePageProps = {
  title: string;
};

export default function HomePage({ title }: HomePageProps) {
  return (
    <div className="">
      <Client client={"Empresa"} rep={"Representante"} link={"#"} />
    </div>
  );
}
