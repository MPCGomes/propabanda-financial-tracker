import { IoSearchSharp } from "react-icons/io5";
import Header from "../components/Header";
import Order from "../components/Order";
import { FaPlus } from "react-icons/fa6";
import FloatingButton from "../components/FloatingButton";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";

type PlaceholderPageProps = {
  title: string;
};

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-center min-h-screen lg:p-3 lg:items-start">
      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Header */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg 
                flex justify-center p-1
                lg:w-35 lg:flex lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header orders="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:pb-0 lg:ml-40">
          <div className="flex gap-5 flex-col lg:flex-row lg:justify-between lg:items-center">
            <SearchBar />

            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <Filter text={"Ordem"} />
              <Filter text={"Data"} />
              <Filter text={"Status"} />
              <Filter text={"Item"} />
            </div>
          </div>
          <div className="flex flex-col gap-3 p-2 bg-white rounded-lg">
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
            <Order
              product={"Produto"}
              date={"01/01/01"}
              value={"100,00"}
              color={"#32c058"}
              link={"#"}
              icon={"+"}
            />
          </div>
        </div>
      </div>
      <a
        href="/order/register"
        className="fixed bottom-25 right-4 lg:bottom-10 lg:right-5"
      >
        <FloatingButton icon={<FaPlus />} background={"#FFA322"} />
      </a>
    </section>
  );
}
