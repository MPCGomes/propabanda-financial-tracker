import DashboardHeader from "../components/DashboardHeader";

type HomePageProps = {
  title: string;
};

export default function HomePage({ title }: HomePageProps) {
  return (
    <div className="">
      <DashboardHeader evolution='Dash'/>
    </div>
  );
}
