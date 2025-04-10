import Header from "../components/Header";
import PlaceholderBox from "../components/PlaceholderComponent";

type PlaceholderPageProps = {
  title: string;
};

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3">
          <div className="w-full max-w-[1280px] flex lg:flex-row gap-5">
            {/* Header */}
            <div
              className="fixed bottom-0 w-full bg-white rounded-lg 
            flex justify-center p-1
            lg:static lg:w-40 lg:flex lg:flex-col lg:justify-start lg:p-2"
            >
              <Header clients="active" />
            </div>
    
            {/* Content */}
            <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0">
             
              
            </div>
          </div>
        </section>
  );
}
