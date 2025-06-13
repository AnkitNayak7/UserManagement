import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

const chartTypes = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "pie", label: "Pie" },
];

const defaultBarData = {
  categories: ["A", "B", "C"],
  series: [{ name: "Series 1", data: [10, 20, 30] }],
};
const defaultLineData = {
  categories: ["A", "B", "C"],
  series: [{ name: "Series 1", data: [5, 15, 25] }],
};
const defaultPieData = {
  categories: ["A", "B", "C"],
  series: [{ name: "Series 1", data: [40, 30, 30] }],
};

function getDefaultData(type: string) {
  if (type === "bar") return { ...defaultBarData };
  if (type === "line") return { ...defaultLineData };
  if (type === "pie") return { ...defaultPieData };
  return { categories: [], series: [] };
}

const Dashboard: React.FC = () => {
  const [charts, setCharts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "bar",
    categories: ["A", "B", "C"],
    series: [{ name: "Series 1", data: [10, 20, 30] }],
  });

  // Open modal for add/edit
  const openAddModal = () => {
    setEditIndex(null);
    setForm({
      title: "",
      type: "bar",
      ...getDefaultData("bar"),
    });
    setShowModal(true);
  };
  const openEditModal = (idx: number) => {
    const chart = charts[idx];
    setEditIndex(idx);
    setForm({
      title: chart.title,
      type: chart.type,
      categories: [...chart.categories],
      series: chart.series.map((s: any) => ({ ...s })),
    });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // Handle form changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Handle category/series changes
  const handleCategoryChange = (idx: number, value: string) => {
    const categories = [...form.categories];
    categories[idx] = value;
    setForm({ ...form, categories });
  };
  const handleSeriesNameChange = (sidx: number, value: string) => {
    const series = form.series.map((s, i) =>
      i === sidx ? { ...s, name: value } : s,
    );
    setForm({ ...form, series });
  };
  const handleSeriesDataChange = (
    sidx: number,
    didx: number,
    value: string,
  ) => {
    const series = form.series.map((s, i) =>
      i === sidx
        ? {
            ...s,
            data: s.data.map((d: any, j: number) =>
              j === didx ? Number(value) : d,
            ),
          }
        : s,
    );
    setForm({ ...form, series });
  };
  // Add/remove categories/series
  const addCategory = () =>
    setForm({ ...form, categories: [...form.categories, ""] });
  const removeCategory = (idx: number) => {
    const categories = form.categories.filter((_, i) => i !== idx);
    const series = form.series.map((s) => ({
      ...s,
      data: s.data.filter((_, i) => i !== idx),
    }));
    setForm({ ...form, categories, series });
  };
  const addSeries = () => {
    setForm({
      ...form,
      series: [
        ...form.series,
        {
          name: `Series ${form.series.length + 1}`,
          data: form.categories.map(() => 0),
        },
      ],
    });
  };
  const removeSeries = (sidx: number) => {
    setForm({ ...form, series: form.series.filter((_, i) => i !== sidx) });
  };
  // When type changes, reset data
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setForm({
      ...form,
      type,
      ...getDefaultData(type),
    });
  };

  // Save chart
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      setCharts((charts) =>
        charts.map((c, i) => (i === editIndex ? { ...form } : c)),
      );
    } else {
      setCharts((charts) => [...charts, { ...form }]);
    }
    setShowModal(false);
  };
  // Delete chart
  const handleDelete = (idx: number) => {
    setCharts((charts) => charts.filter((_, i) => i !== idx));
  };

  // ECharts option generator
  const getOption = (chart: any) => {
    if (chart.type === "pie") {
      return {
        title: { text: chart.title, left: "center" },
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left" },
        series: [
          {
            name: chart.series[0]?.name,
            type: "pie",
            radius: "50%",
            data: chart.categories.map((cat: string, i: number) => ({
              name: cat,
              value: chart.series[0]?.data[i],
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    }
    // Bar/Line
    return {
      title: { text: chart.title },
      tooltip: { trigger: "axis" },
      legend: { data: chart.series.map((s: any) => s.name) },
      xAxis: { type: "category", data: chart.categories },
      yAxis: { type: "value" },
      series: chart.series.map((s: any) => ({
        name: s.name,
        type: chart.type,
        data: s.data,
      })),
    };
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={openAddModal}
          >
            Add Chart
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((chart, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  {chart.title || "Untitled Chart"}
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => openEditModal(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <ReactECharts option={getOption(chart)} style={{ height: 300 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Config Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold mb-4">
              {editIndex !== null ? "Edit Chart" : "Add Chart"}
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="title"
                  placeholder="Chart Title"
                  className="border rounded px-3 py-2 bg-white text-black dark:bg-black dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                />
                <select
                  name="type"
                  className="border rounded px-3 py-2 bg-white text-black dark:bg-black dark:text-white w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.type}
                  onChange={handleTypeChange}
                >
                  {chartTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Categories (not for pie) */}
              {form.type !== "pie" && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Categories</span>
                    <button
                      type="button"
                      className="text-blue-600"
                      onClick={addCategory}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.categories.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <input
                          className="border rounded px-2 py-1 bg-white text-black dark:bg-black dark:text-white w-24 focus:outline-none"
                          value={cat}
                          onChange={(e) =>
                            handleCategoryChange(idx, e.target.value)
                          }
                          required
                        />
                        {form.categories.length > 1 && (
                          <button
                            type="button"
                            className="text-red-600"
                            onClick={() => removeCategory(idx)}
                          >
                            x
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Series */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Series</span>
                  <button
                    type="button"
                    className="text-blue-600"
                    onClick={addSeries}
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {form.series.map((s, sidx) => (
                    <div
                      key={sidx}
                      className="flex flex-col md:flex-row gap-2 items-center"
                    >
                      <input
                        className="border rounded px-2 py-1 bg-white text-black dark:bg-black dark:text-white w-32 focus:outline-none"
                        value={s.name}
                        onChange={(e) =>
                          handleSeriesNameChange(sidx, e.target.value)
                        }
                        required
                      />
                      <div className="flex gap-1">
                        {form.categories.map((cat, didx) => (
                          <input
                            key={didx}
                            type="number"
                            className="border rounded px-2 py-1 bg-white text-black dark:bg-black dark:text-white w-16 focus:outline-none"
                            value={s.data[didx]}
                            onChange={(e) =>
                              handleSeriesDataChange(sidx, didx, e.target.value)
                            }
                            required
                          />
                        ))}
                      </div>
                      {form.series.length > 1 && (
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => removeSeries(sidx)}
                        >
                          x
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Live Preview */}
              <div>
                <span className="font-medium">Live Preview</span>
                <div className="bg-gray-100 dark:bg-gray-900 rounded p-2 mt-2">
                  <ReactECharts
                    option={getOption(form)}
                    style={{ height: 250 }}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  {editIndex !== null ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
