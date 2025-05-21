import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import DashboardHeader from "../../components/DashboardHeader";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import Money from "../../components/Money";
import AlertModal from "../../components/AlertModal";
import ErrorModal from "../../components/ErrorModal";
import SectionCard from "../../components/SectionCard";
import { useModal } from "../../hooks/useModal";
import { useShowValues } from "../../contexts/ShowValuesContext";

import { MdFileUpload } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

import api from "../../lib/api";

import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import Modal from "../../components/Modal";
Chart.register(ArcElement, Tooltip, Legend);

const Doughnut = lazy(() =>
  import("react-chartjs-2").then((m) => ({ default: m.Doughnut }))
);

type ItemPerf = {
  itemId: number;
  itemName: string;
  totalRevenue: number;
  percentageOfTotal: number;
};

type PerformanceDTO = {
  finalBalance: number;
  itemPerformances: ItemPerf[];
};

type ItemOption = { id: number; name: string };

const iso = (d: Date) => d.toISOString().slice(0, 10);
const firstDayYear = () => iso(new Date(new Date().getFullYear(), 0, 1));

export default function DashboardPerformance() {
  const { show } = useShowValues();

  const periodModal = useModal(false);
  const itemModal = useModal(false);
  const importModal = useModal(false);

  const [period, setPeriod] = useState<{ start: string; end: string }>({
    start: firstDayYear(),
    end: iso(new Date()),
  });
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItems, setSelected] = useState<number[]>([]);

  const [perf, setPerf] = useState<PerformanceDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    api
      .get<ItemOption[]>("/api/items")
      .then(({ data }) =>
        setItems(data.map((i) => ({ id: i.id, name: i.name })))
      )
      .catch(() => setErr("Falha ao carregar itens."));
  }, []);

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
  }, []);

  const chartData = useMemo(() => {
    if (!perf) return null;
    return {
      labels: perf.itemPerformances.map((p) => p.itemName),
      datasets: [{ data: perf.itemPerformances.map((p) => p.totalRevenue) }],
    };
  }, [perf]);

  const periodActive =
    period.start !== firstDayYear() || period.end !== iso(new Date());
  const itemActive = selectedItems.length > 0;

  const toggleItem = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );

  const colors = ["#FFA322", "#FFB24D", "#FFC27A", "#FFD1A6", "#FFE0D1"];

  const handleExport = async () => {
    try {
      const { data } = await api.get("/api/export/report.xlsx", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio_completo.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ??
          "Falha interna ao gerar o arquivo de exportação."
      );
    }
  };

  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <ErrorModal error={err} onClose={() => setErr(null)} />
      <AlertModal
        isOpen={!!alertMsg}
        title="Sucesso"
        onClose={() => setAlertMsg(null)}
      >
        <p className="text-sm text-[#282828]">{alertMsg}</p>
      </AlertModal>

      <div className="w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1 lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10">
          <Header dashboard="active" />
        </div>

        <div className="flex flex-col gap-5 w-full p-4 pb-[100px] lg:p-0 lg:ml-40">
          <UserHeader />

          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <DashboardHeader performance="Dash" />
            <div className="flex gap-3">
              <Filter
                text="Período"
                variant={periodActive ? "filtered" : "default"}
                onClick={periodModal.open}
              />
              <Filter
                text="Item"
                variant={itemActive ? "filtered" : "default"}
                onClick={itemModal.open}
              />
            </div>
          </div>

          <Modal
            isOpen={periodModal.isOpen}
            onClose={periodModal.close}
            title="Período"
          >
            <div className="flex gap-2">
              <div className="w-full">
                <label className="text-sm text-[#282828]">Início</label>
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
                <label className="text-sm text-[#282828]">Fim</label>
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
                periodModal.close();
                fetchPerf();
              }}
            >
              Aplicar
            </Button>
          </Modal>

          <Modal
            isOpen={itemModal.isOpen}
            onClose={itemModal.close}
            title="Itens"
          >
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
              {items.map((it) => (
                <label key={it.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(it.id)}
                    onChange={() => toggleItem(it.id)}
                  />
                  {it.name}
                </label>
              ))}
            </div>
            <Button
              onClick={() => {
                itemModal.close();
                fetchPerf();
              }}
            >
              Aplicar
            </Button>
          </Modal>

          <Modal
            isOpen={importModal.isOpen}
            onClose={() => {
              setImportFile(null);
              importModal.close();
            }}
            title="Importar Pedidos"
          >
            <label className="flex flex-col items-center gap-2 p-6 border-dashed border border-[#28282833] rounded-lg bg-[#fafafa] cursor-pointer">
              <p className="text-2xl">
                <MdFileUpload />
              </p>
              <p className="text-sm">
                {importFile ? importFile.name : "Clique para selecionar .xlsx"}
              </p>
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className="flex gap-3 justify-end mt-4">
              <Button
                variant="outlined"
                onClick={() => {
                  setImportFile(null);
                  importModal.close();
                }}
              >
                Cancelar
              </Button>
              <Button
                disabled={!importFile}
                onClick={async () => {
                  if (!importFile) return;
                  try {
                    const form = new FormData();
                    form.append("file", importFile);
                    await api.post("/api/import", form, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    setAlertMsg("Importação concluída com sucesso.");
                    fetchPerf();
                  } catch {
                    setErr("Falha interna ao importar o arquivo.");
                  } finally {
                    setImportFile(null);
                    importModal.close();
                  }
                }}
              >
                Enviar
              </Button>
            </div>
          </Modal>

          <SectionCard title="">
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
                        data={{
                          ...chartData,
                          datasets: [
                            {
                              ...chartData.datasets[0],
                              backgroundColor: colors,
                              borderWidth: 0,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: { position: "bottom" },
                            tooltip: {
                              callbacks: {
                                label: (ctx) =>
                                  show
                                    ? `R$ ${(+ctx.parsed).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
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
          </SectionCard>

          <SectionCard title="Histórico">
            {perf?.itemPerformances.map((it, idx) => (
              <div
                key={it.itemId}
                className={`flex justify-between p-2 ${idx % 2 === 0 ? "bg-[#fafafa]" : ""} rounded-md`}
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
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outlined" onClick={importModal.open}>
                <MdFileUpload /> Importar
              </Button>
              <Button onClick={handleExport}>
                <IoMdDownload /> Exportar
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
