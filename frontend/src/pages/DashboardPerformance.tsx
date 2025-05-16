/* src/pages/DashboardPerformance.tsx ---------------------------------- */
import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import DashboardHeader from "../components/DashboardHeader";
import Filter from "../components/Filter";
import Modal from "../components/Modal";
import Button from "../components/Button";
import DialogModal from "../components/DialogModal";
import Money from "../components/Money";
import { useShowValues } from "../contexts/ShowValuesContext";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdFileUpload,
} from "react-icons/md";
import api from "../lib/api";

// Chart
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { IoMdDownload } from "react-icons/io";
Chart.register(ArcElement, Tooltip, Legend);

const Doughnut = lazy(() =>
  import("react-chartjs-2").then((m) => ({ default: m.Doughnut }))
);

interface ItemPerf {
  itemId: number;
  itemName: string;
  totalRevenue: number;
  percentageOfTotal: number;
}
interface PerformanceDTO {
  finalBalance: number;
  itemPerformances: ItemPerf[];
}
type ItemOption = { id: number; name: string };

// Helpers
const iso = (d: Date) => d.toISOString().slice(0, 10);
const firstDayYear = () => iso(new Date(new Date().getFullYear(), 0, 1));

export default function DashboardPerformance() {
  const { show } = useShowValues();

  // Filters
  const [period, setPeriod] = useState<{ start: string; end: string }>({
    start: firstDayYear(),
    end: iso(new Date()),
  });
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItems, setSelected] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState<null | "period" | "item">(null);

  // Data
  const [perf, setPerf] = useState<PerformanceDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // UI
  const [showList, setShowList] = useState(false);

  // Fetch
  useEffect(() => {
    api
      .get("/api/items")
      .then(({ data }) =>
        setItems(data.map((i: any) => ({ id: i.id, name: i.name })))
      )
      .catch(() => setErr("Falha ao carregar itens."));
  }, []);

  // Fetch
  const fetchPerf = async () => {
    try {
      const body = {
        startDate: period.start,
        endDate: period.end,
        itemIds: selectedItems.length ? selectedItems : null,
      };
      const { data } = await api.post<PerformanceDTO>(
        "/api/dashboard/performance",
        body
      );
      setPerf({
        finalBalance: +data.finalBalance,
        itemPerformances: data.itemPerformances.map((p) => ({
          ...p,
          totalRevenue: +p.totalRevenue,
          percentageOfTotal: +p.percentageOfTotal,
        })),
      });
    } catch {
      setErr("Falha ao carregar dados de performance.");
    }
  };
  useEffect(() => {
    fetchPerf();
  }, [period, selectedItems]);

  // Chart
  const chartData = useMemo(() => {
    if (!perf) return null;
    return {
      labels: perf.itemPerformances.map((p) => p.itemName),
      datasets: [
        {
          data: perf.itemPerformances.map((p) => p.totalRevenue),
        },
      ],
    };
  }, [perf]);

  // Filter Flags
  const periodActive =
    period.start !== firstDayYear() || period.end !== iso(new Date());
  const itemActive = selectedItems.length > 0;

  // Item Checklist
  const toggleItem = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <DialogModal
        isOpen={!!err}
        message={err ?? ""}
        onClose={() => setErr(null)}
      />

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Menu */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1
                        lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header dashboard="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:ml-40">
          <UserHeader user="Johnny" />

          {/* Header + Filters */}
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <DashboardHeader performance="Dash" />
            <div className="flex gap-3">
              <Filter
                text="Período"
                variant={periodActive ? "filtered" : "default"}
                onClick={() => setOpenModal("period")}
              />
              <Filter
                text="Item"
                variant={itemActive ? "filtered" : "default"}
                onClick={() => setOpenModal("item")}
              />
            </div>
          </div>

          {/* Period Modal */}
          <Modal
            isOpen={openModal === "period"}
            onClose={() => setOpenModal(null)}
            title="Período"
          >
            <div className="flex gap-2">
              <div className="w-full">
                <label htmlFor="" className="text-sm text-[#282828]">
                  Início
                </label>
                <input
                  type="date"
                  value={period.start}
                  onChange={(e) =>
                    setPeriod((p) => ({ ...p, start: e.target.value }))
                  }
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div className="w-full">
                <label htmlFor="" className="text-sm text-[#282828]">
                  Fim
                </label>
                <input
                  type="date"
                  value={period.end}
                  onChange={(e) =>
                    setPeriod((p) => ({ ...p, end: e.target.value }))
                  }
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                setOpenModal(null);
                fetchPerf();
              }}
            >
              Aplicar
            </Button>
          </Modal>

          {/* Item Modal */}
          <Modal
            isOpen={openModal === "item"}
            onClose={() => setOpenModal(null)}
            title="Itens"
          >
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
              {items.map((it) => (
                <label key={it.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(it.id)}
                    onChange={() => toggleItem(it.id)}
                  />{" "}
                  {it.name}
                </label>
              ))}
            </div>
            <Button
              onClick={() => {
                setOpenModal(null);
                fetchPerf();
              }}
            >
              Aplicar
            </Button>
          </Modal>

          {/* Charts + Balance */}
          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            {perf ? (
              <>
                <div>
                  <p className="text-xs text-[#282828]">
                    Receita total no período
                  </p>
                  <p className="text-2xl font-bold text-[#282828]">
                    R$ <Money value={perf.finalBalance} />
                  </p>
                </div>

                <div style={{ height: 260 }}>
                  <Suspense
                    fallback={<p className="text-sm">Carregando gráfico…</p>}
                  >
                    {chartData && (
                      <Doughnut
                        data={chartData}
                        options={{
                          plugins: {
                            legend: { position: "bottom" },
                            tooltip: {
                              callbacks: {
                                label: (ctx) =>
                                  show
                                    ? `R$ ${(+ctx.parsed).toLocaleString(
                                        "pt-BR",
                                        { minimumFractionDigits: 2 }
                                      )}`
                                    : "***",
                              },
                            },
                          },
                          cutout: "60%",
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    )}
                  </Suspense>
                </div>
              </>
            ) : (
              <p className="text-sm text-center text-gray-500">Carregando…</p>
            )}
          </div>

          {/* History */}
          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            <p className="text-base font-medium text-[#282828]">Histórico</p>

            {perf?.itemPerformances.map((it, idx) => (
              <div
                key={it.itemId}
                className={`flex justify-between p-2 ${
                  idx % 2 === 0 ? "bg-[#fafafa]" : ""
                } rounded-md`}
              >
                <p className="text-xs font-medium text-[#28282899]">
                  {it.itemName}
                </p>
                <div className="text-right">
                  <p className="text-base text-[#282828]">
                    R$ <Money value={it.totalRevenue} />
                  </p>
                  <p className="text-xs" style={{ color: "#32c058" }}>
                    {show ? `${it.percentageOfTotal.toFixed(2)}%` : "***"}
                  </p>
                </div>
              </div>
            ))}

            {perf && perf.itemPerformances.length === 0 && (
              <p className="text-xs text-center text-[#888]">
                Nenhum dado no período.
              </p>
            )}
            {/* Export + Import Buttons */}
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outlined">
                <MdFileUpload /> Importar
              </Button>
              <Button>
                <IoMdDownload /> Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
