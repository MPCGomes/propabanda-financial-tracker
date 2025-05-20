import { useEffect, useMemo, useState, lazy, Suspense, JSX } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import DashboardHeader from "../components/DashboardHeader";
import Filter from "../components/Filter";
import Modal from "../components/Modal";
import Button from "../components/Button";
import DialogModal from "../components/DialogModal";
import Money from "../components/Money";

import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdFileUpload,
} from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";

import api from "../lib/api";

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { useShowValues } from "../contexts/ShowValuesContext";
import { IoMdDownload } from "react-icons/io";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);
const Line = lazy(() =>
  import("react-chartjs-2").then((m) => ({ default: m.Line }))
);

type ItemOption = { id: number; name: string };
type OrderResume = {
  id: number;
  identifier: string;
  emissionDate: string;
  discountedValue: number;
  clientName: string;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const firstDayYear = () => iso(new Date(new Date().getFullYear(), 0, 1));

export default function Dashboard() {
  const navigate = useNavigate();
  const { show } = useShowValues();

  const [period, setPeriod] = useState<{ start: string; end: string }>({
    start: firstDayYear(),
    end: iso(new Date()),
  });
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItems, setSelItems] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState<
    null | "period" | "item" | "import"
  >(null);

  const [orders, setOrders] = useState<OrderResume[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [showEntryList, setShowEntryList] = useState(false);

  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    api
      .get("/api/items")
      .then(({ data }) =>
        setItems(data.map((i: any) => ({ id: i.id, name: i.name })))
      )
      .catch(() => setErr("Falha ao carregar itens."));
  }, []);

  const fetchOrders = async () => {
    try {
      const body = {
        search: "",
        sortBy: "emissionDate",
        direction: "asc",
        startDate: period.start,
        endDate: period.end,
        itemIds: selectedItems,
      };
      const { data } = await api.post("/api/orders/filter", body);
      setOrders(
        data.map((o: any) => ({
          id: o.id,
          identifier: o.identifier,
          emissionDate: o.emissionDate,
          discountedValue: +o.discountedValue,
          clientName: o.client?.name ?? o.clientName ?? "—",
        }))
      );
    } catch {
      setErr("Falha ao carregar dados do dashboard.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const summary = useMemo(() => {
    const totalIn = orders.reduce((s, o) => s + o.discountedValue, 0);
    const startBal = 0;
    const endBal = startBal + totalIn;
    const variation =
      startBal === 0
        ? totalIn === 0
          ? 0
          : 100
        : ((endBal - startBal) / startBal) * 100;

    return { count: orders.length, totalIn, startBal, endBal, variation };
  }, [orders]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const key = o.emissionDate.slice(0, 7);
      map.set(key, (map.get(key) || 0) + o.discountedValue);
    });
    const labels = [...map.keys()].sort();
    return {
      labels,
      datasets: [
        {
          label: "Entradas",
          data: labels.map((l) => map.get(l)),
          tension: 0.3,
          fill: false,
          borderColor: "#FFA322",
          backgroundColor: "#FFA322",
        },
      ],
    };
  }, [orders]);

  const toggleItem = (id: number) =>
    setSelItems((p) =>
      p.includes(id) ? p.filter((n) => n !== id) : [...p, id]
    );

  const periodActive =
    period.start !== firstDayYear() || period.end !== iso(new Date());
  const itemActive = selectedItems.length > 0;

  const handleExport = async () => {
    try {
      const body = {
        startDate: period.start,
        endDate: period.end,
        itemIds: selectedItems,
      };
      const { data } = await api.post("/api/export/report.xlsx", body, {
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
      <DialogModal
        isOpen={!!err}
        message={err ?? ""}
        onClose={() => setErr(null)}
      />

      <div className="p-4 lg:p-0 w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1
                        lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header dashboard="active" />
        </div>

        <div className="flex flex-col gap-5 w-full pb-[100px] lg:ml-40">
          <UserHeader />

          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <DashboardHeader evolution="Dash" />
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

          <Modal
            isOpen={openModal === "period"}
            onClose={() => setOpenModal(null)}
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
                setOpenModal(null);
                fetchOrders();
              }}
            >
              Aplicar Filtro
            </Button>
          </Modal>

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
                  />
                  {it.name}
                </label>
              ))}
            </div>
            <Button
              onClick={() => {
                setOpenModal(null);
                fetchOrders();
              }}
            >
              Aplicar Filtro
            </Button>
          </Modal>

          <Modal
            isOpen={openModal === "import"}
            onClose={() => {
              setImportFile(null);
              setOpenModal(null);
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
                  setOpenModal(null);
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
                    setErr("Importação concluída com sucesso.");
                    fetchOrders();
                  } catch (e: any) {
                    setErr(
                      e?.response?.data?.message ??
                        "Falha interna ao importar o arquivo."
                    );
                  } finally {
                    setImportFile(null);
                    setOpenModal(null);
                  }
                }}
              >
                Enviar
              </Button>
            </div>
          </Modal>

          <div className="flex flex-col gap-5 p-5 bg-white rounded-lg">
            <div className="text-[#282828]">
              <p className="text-xs">Saldo no período</p>
              <p className="text-xl font-bold">
                R$ <Money value={summary.endBal} />
              </p>
              <p className="flex gap-1 text-xs">
                <span className="flex items-center gap-1 text-[#32c058]">
                  <FaArrowUp /> R$ <Money value={summary.totalIn} />
                </span>{" "}
                de entradas no período
              </p>
            </div>

            <div style={{ height: 220 }}>
              <Suspense
                fallback={<p className="text-sm">Carregando gráfico…</p>}
              >
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx) =>
                            show ? `R$ ${ctx.parsed.y.toFixed(2)}` : "***",
                        },
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (v) =>
                            show ? `R$ ${(+v).toLocaleString("pt-BR")}` : "***",
                        },
                      },
                    },
                  }}
                />
              </Suspense>
            </div>
          </div>

          <div className="flex flex-col p-5 bg-white rounded-lg">
            <p className="text-base font-medium text-[#282828] mb-5">
              Histórico
            </p>

            <Row label="Saldo Inicial" value={summary.startBal} gray />
            <Row label="Nº de Pedidos" value={summary.count} />
            <div className="flex flex-col  bg-[#fafafa] rounded-md">
              <Row
                label="Entradas"
                value={summary.totalIn}
                clickable
                onClick={() => setShowEntryList((p) => !p)}
                icon={
                  showEntryList ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )
                }
              />
              {showEntryList && (
                <ul className="text-sm text-[#282828] px-2 pb-2 space-y-2">
                  {orders.map((o) => (
                    <li
                      key={o.id}
                      className="flex justify-between cursor-pointer hover:text-[#FFA322]"
                      onClick={() => navigate(`/orders/${o.id}`)}
                    >
                      <span>
                        Pedido Nº {o.identifier}
                        <span className="text-xs text-[#888]">
                          {" "}
                          ({o.emissionDate} - {o.clientName})
                        </span>
                      </span>
                      <span className="ml-2">
                        R$ <Money value={o.discountedValue} />
                      </span>
                    </li>
                  ))}
                  {!orders.length && (
                    <li className="text-xs text-[#888]">Nenhum pedido.</li>
                  )}
                </ul>
              )}
            </div>

            <Row label="Variação em %" value={summary.variation} />
            <Row label="Saldo Final" value={summary.endBal} gray />

            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outlined" onClick={() => setOpenModal("import")}>
                <MdFileUpload /> Importar
              </Button>
              <Button onClick={handleExport}>
                <IoMdDownload /> Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  gray = false,
  onClick,
  clickable = false,
  icon,
}: {
  label: string;
  value: number | undefined;
  gray?: boolean;
  onClick?: () => void;
  clickable?: boolean;
  icon?: JSX.Element;
}) {
  const { show } = useShowValues();

  let rendered: JSX.Element = <></>;
  if (label === "Nº de Pedidos") {
    rendered = <>{show ? value : "***"}</>;
  } else if (label === "Variação em %") {
    rendered = <>{show ? `${(value ?? 0).toFixed(2)}%` : "***"}</>;
  } else {
    rendered =
      typeof value === "number" ? (
        <>
          R$ <Money value={value} />
        </>
      ) : (
        <>***</>
      );
  }

  const color =
    label === "Variação em %"
      ? value !== undefined && value < 0
        ? "#ee3a4b"
        : "#32c058"
      : undefined;

  return (
    <div
      className={`flex items-center justify-between p-2 ${gray ? "bg-[#fafafa]" : ""} ${clickable ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <p className="text-xs font-medium text-[#28282833]">{label}</p>
      <p className="text-base flex items-center gap-1" style={{ color }}>
        {rendered} {icon}
      </p>
    </div>
  );
}
