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

// Types
type ItemOption = { id: number; name: string };
type OrderResume = {
  id: number;
  identifier: string;
  emissionDate: string;
  discountedValue: number;
  items: { itemId: number; itemName: string }[];
};

// Helpers
const iso = (d: Date) => d.toISOString().slice(0, 10);
const firstDayYear = () => iso(new Date(new Date().getFullYear(), 0, 1));

export default function Dashboard() {
  const navigate = useNavigate();
  const { show } = useShowValues();

  // Filters
  const [period, setPeriod] = useState<{ start: string; end: string }>({
    start: firstDayYear(),
    end: iso(new Date()),
  });
  const [items, setItems] = useState<ItemOption[]>([]);
  const [selectedItems, setSelItems] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState<null | "period" | "item">(null);

  // Data Errors
  const [orders, setOrders] = useState<OrderResume[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [showEntryList, setShowEntryList] = useState(false);

  // Fetch Items
  useEffect(() => {
    api
      .get("/api/items")
      .then(({ data }) =>
        setItems(data.map((i: any) => ({ id: i.id, name: i.name })))
      )
      .catch(() => setErr("Falha ao carregar itens."));
  }, []);

  // Fetch Orders
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
          items: o.items.map((it: any) => ({ id: it.id, name: it.name })),
        }))
      );
    } catch {
      setErr("Falha ao carregar dados do dashboard.");
    }
  };

  // Initial Load + Refresh Load
  useEffect(() => {
    fetchOrders();
  }, [period, selectedItems]);

  // Summary
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

  // Chart
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

  // Helpers
  const toggleItem = (id: number) =>
    setSelItems((p) =>
      p.includes(id) ? p.filter((n) => n !== id) : [...p, id]
    );

  const periodActive =
    period.start !== firstDayYear() || period.end !== iso(new Date());
  const itemActive = selectedItems.length > 0;

  // UI
  return (
    <section className="bg-[#f6f6f6] lg:flex justify-center items-start min-h-screen lg:p-3">
      <DialogModal
        isOpen={!!err}
        message={err ?? ""}
        onClose={() => setErr(null)}
      />

      <div className="p-4 lg:p-0 w-full max-w-[1280px] flex lg:flex-row gap-5 pt-12 lg:pt-20 lg:pb-22">
        {/* Menu */}
        <div
          className="fixed bottom-0 w-full bg-white rounded-lg flex justify-center p-1
                        lg:w-35 lg:flex-col lg:justify-start lg:p-2 lg:top-23 lg:bottom-25 z-10"
        >
          <Header dashboard="active" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 w-full pb-[100px] lg:ml-40">
          <UserHeader user="Johnny" />

          {/* Header + Filters */}
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
                fetchOrders();
              }}
            >
              Aplicar Filtro
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

          {/* Balance + Chart */}
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
                            show ? `R$ ${(+v).toFixed(0)}` : "***",
                        },
                      },
                    },
                  }}
                />
              </Suspense>
            </div>
          </div>

          {/* History */}
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
                    <li key={o.id} /* … */>
                      <span>
                        Pedido Nº {o.identifier}
                        <span className="text-xs text-[#888]">
                          {" "}
                          ({o.emissionDate})
                        </span>
                      </span>
                      <span>
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

            {/* Export + Import Buttons */}
            {/* Import / Export */}
            <div className="flex gap-3 justify-end mt-4">
              {/* Import */}
              <label className="relative inline-flex">
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files?.length) return;
                    const form = new FormData();
                    form.append("file", e.target.files[0]);
                    await api.post("/api/import/orders", form, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    fetchOrders();
                  }}
                />
                <Button variant="outlined">
                  <MdFileUpload /> Importar
                </Button>
              </label>

              {/* Export */}
              <Button
                onClick={() =>
                  window.open(
                    `${api.defaults.baseURL}/api/export/report.xlsx`,
                    "_blank"
                  )
                }
              >
                <IoMdDownload /> Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Row Helper
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
