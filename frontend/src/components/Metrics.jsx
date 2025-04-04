import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const StockMetricsDashboard = ({ stockData }) => {
  // Default data in case no props are passed
  const defaultData = {
    Ticker: "AAPL",
    "Company Name": "Apple Inc.",
    Sector: "Technology",
    Industry: "Consumer Electronics",
    "Market Cap": 2800000000000,
    "P/E Ratio": 28.5,
    "P/B Ratio": 35.2,
    "Dividend Yield": 0.005,
    "Return on Equity (ROE)": 0.145,
    "Debt to Equity Ratio": 1.5,
    "Current Price": 185.92,
    "52-Week High": 199.62,
    "52-Week Low": 143.9,
    Beta: 1.28,
    "EPS (TTM)": 6.14,
    "Operating Margin": 0.301,
    "Profit Margin": 0.255,
    Revenue: 383801000000,
    "Revenue Growth": 0.065,
    "Earnings Growth": 0.075,
    "Analyst Recommendation Mean": 2.1,
    "Analyst Recommendation Key": "buy",
    "Target Mean Price": 210.5,
    "Number of Analysts": 35,
  };

  const data = stockData || defaultData;

  // Color schemes
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");

  // Format large numbers
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "N/A";

    if (num >= 1000000000000) {
      return `$${(num / 1000000000000).toFixed(2)}T`;
    }
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    if (typeof num === "number") {
      return num.toLocaleString();
    }

    return num;
  };

  // Format percentage values
  const formatPercent = (num) => {
    if (num === undefined || num === null) return "N/A";
    return `${(num * 100).toFixed(2)}%`;
  };

  // Determine if a metric is good, bad, or neutral
  const getMetricStatus = (metric, value) => {
    if (value === undefined || value === null) return "neutral";

    switch (metric) {
      case "P/E Ratio":
        return value < 15 ? "good" : value > 30 ? "bad" : "neutral";
      case "P/B Ratio":
        return value < 3 ? "good" : value > 7 ? "bad" : "neutral";
      case "Dividend Yield":
        return value > 0.02 ? "good" : value === 0 ? "bad" : "neutral";
      case "Return on Equity (ROE)":
        return value > 0.15 ? "good" : value < 0.1 ? "bad" : "neutral";
      case "Debt to Equity Ratio":
        return value < 1 ? "good" : value > 2 ? "bad" : "neutral";
      case "Operating Margin":
        return value > 0.15 ? "good" : value < 0.05 ? "bad" : "neutral";
      case "Profit Margin":
        return value > 0.1 ? "good" : value < 0.05 ? "bad" : "neutral";
      case "Revenue Growth":
        return value > 0.1 ? "good" : value < 0.05 ? "bad" : "neutral";
      case "Earnings Growth":
        return value > 0.15 ? "good" : value < 0.05 ? "bad" : "neutral";
      case "Analyst Recommendation Mean":
        return value < 2.2 ? "good" : value > 3 ? "bad" : "neutral";
      default:
        return "neutral";
    }
  };

  // Get explanation for a metric
  const getMetricExplanation = (metric) => {
    switch (metric) {
      case "P/E Ratio":
        return "Price-to-Earnings ratio compares stock price to earnings per share. Lower is better, suggesting the stock is potentially undervalued. Above 30 may indicate overvaluation.";
      case "P/B Ratio":
        return "Price-to-Book ratio compares stock price to book value. Lower values (under 3) may indicate undervaluation. High values might suggest overvaluation or exceptional future growth prospects.";
      case "Dividend Yield":
        return "Annual dividend payment as percentage of stock price. Higher yields provide income but very high yields could signal trouble. Zero means no dividend is paid.";
      case "Return on Equity (ROE)":
        return "Measures profitability relative to shareholders' equity. Higher values (above 15%) indicate efficient use of capital and strong management.";
      case "Debt to Equity Ratio":
        return "Measures financial leverage by comparing debt to equity. Lower values suggest less financial risk. Above 2 may indicate high financial risk.";
      case "Operating Margin":
        return "Percentage of revenue retained after operating expenses. Higher margins indicate operational efficiency and pricing power.";
      case "Profit Margin":
        return "Percentage of revenue converted to profit. Higher margins suggest strong business model and competitive advantages.";
      case "Revenue Growth":
        return "Year-over-year increase in company's sales. Higher growth suggests strong market demand and competitive position.";
      case "Earnings Growth":
        return "Year-over-year increase in profits. Sustained high growth may lead to higher stock valuations.";
      case "Market Cap":
        return "Total market value of all outstanding shares. Larger companies tend to be more stable but may grow slower than smaller ones.";
      case "Beta":
        return "Measure of stock volatility compared to the market. Beta > 1 means more volatile than the market; beta < 1 means less volatile.";
      case "Current Price":
        return "Latest trading price of the stock.";
      case "52-Week High/Low":
        return "Highest and lowest price points in the past year. Shows trading range and potential support/resistance levels.";
      case "Analyst Recommendations":
        return "Average rating from financial analysts. Lower values (closer to 1) indicate stronger buy recommendations.";
      default:
        return "Financial metric used to evaluate company performance and health.";
    }
  };

  // Price position relative to 52-week range
  const pricePosition =
    ((data["Current Price"] - data["52-Week Low"]) /
      (data["52-Week High"] - data["52-Week Low"])) *
    100;

  // Stock performance potential based on analyst targets
  const upside =
    ((data["Target Mean Price"] - data["Current Price"]) /
      data["Current Price"]) *
    100;

  // Prepare data for charts
  const valuationChartData = [
    { name: "P/E Ratio", value: data["P/E Ratio"] || 0 },
    { name: "P/B Ratio", value: data["P/B Ratio"] || 0 },
    {
      name: "ROE",
      value: data["Return on Equity (ROE)"]
        ? data["Return on Equity (ROE)"] * 100
        : 0,
    },
    {
      name: "Dividend Yield",
      value: data["Dividend Yield"] ? data["Dividend Yield"] * 100 : 0,
    },
  ];

  const profitabilityChartData = [
    {
      name: "Operating Margin",
      value: data["Operating Margin"] ? data["Operating Margin"] * 100 : 0,
    },
    {
      name: "Profit Margin",
      value: data["Profit Margin"] ? data["Profit Margin"] * 100 : 0,
    },
  ];

  const growthChartData = [
    {
      name: "Revenue Growth",
      value: data["Revenue Growth"] ? data["Revenue Growth"] * 100 : 0,
    },
    {
      name: "Earnings Growth",
      value: data["Earnings Growth"] ? data["Earnings Growth"] * 100 : 0,
    },
  ];

  // Render metric card with status and tooltip
  const MetricCard = ({
    title,
    value,
    format = "number",
    showStatus = true,
  }) => {
    const formattedValue =
      format === "percent" ? formatPercent(value) : formatNumber(value);
    const status = showStatus ? getMetricStatus(title, value) : "neutral";
    const explanation = getMetricExplanation(title);

    return (
      <div className="bg-white p-4 rounded-lg shadow-md relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold">{formattedValue}</p>
          </div>
          <div className="flex items-center">
            {status === "good" && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {status === "bad" && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <div className="relative ml-1 group">
              <Info className="h-4 w-4 text-blue-500 cursor-help" />
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white p-2 rounded w-64 right-0 top-full mt-1 text-xs">
                {explanation}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 p-6 rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {data["Company Name"]} ({data["Ticker"]})
            </h1>
            <p className="text-gray-600">
              {data["Sector"]} | {data["Industry"]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              ${data["Current Price"]?.toFixed(2) || "N/A"}
            </p>
            <div
              className={`flex items-center justify-end ${upside >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {upside >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="font-medium">
                {upside.toFixed(2)}% Potential
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "valuation" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("valuation")}
        >
          Valuation
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "profitability" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("profitability")}
        >
          Profitability
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "growth" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("growth")}
        >
          Growth
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Market Cap" value={data["Market Cap"]} />
            <MetricCard title="P/E Ratio" value={data["P/E Ratio"]} />
            <MetricCard title="Beta" value={data["Beta"]} showStatus={false} />
            <MetricCard
              title="Dividend Yield"
              value={data["Dividend Yield"]}
              format="percent"
            />
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">52-Week Price Range</h2>
            <div className="bg-gray-200 h-4 rounded-full relative mb-2">
              <div
                className="absolute h-full bg-blue-500 rounded-full"
                style={{ width: `${pricePosition}%` }}
              ></div>
              <div
                className="absolute w-4 h-4 bg-blue-600 rounded-full -mt-2 -ml-2"
                style={{ left: `${pricePosition}%`, top: "50%" }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>${data["52-Week Low"]?.toFixed(2) || "N/A"}</span>
              <span>
                Current: ${data["Current Price"]?.toFixed(2) || "N/A"}
              </span>
              <span>${data["52-Week High"]?.toFixed(2) || "N/A"}</span>
            </div>
          </div>

          {/* Analyst Recommendations */}
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">
              Analyst Recommendations
            </h2>
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${data["Analyst Recommendation Mean"] < 2.5 ? "bg-green-500" : data["Analyst Recommendation Mean"] < 3.5 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{
                    width: `${((5 - (data["Analyst Recommendation Mean"] || 3)) / 5) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Strong Buy (1.0)</span>
              <span>Hold (3.0)</span>
              <span>Strong Sell (5.0)</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium capitalize">
                    {data["Analyst Recommendation Key"] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Based on {data["Number of Analysts"] || "N/A"} analysts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">
                    Target: ${data["Target Mean Price"]?.toFixed(2) || "N/A"}
                  </p>
                  <p
                    className={`text-sm ${upside >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {upside >= 0 ? "+" : ""}
                    {upside.toFixed(2)}% from current
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Valuation Tab */}
      {activeTab === "valuation" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetricCard title="P/E Ratio" value={data["P/E Ratio"]} />
            <MetricCard title="P/B Ratio" value={data["P/B Ratio"]} />
            <MetricCard
              title="EPS (TTM)"
              value={data["EPS (TTM)"]}
              showStatus={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Valuation Metrics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valuationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Bar dataKey="value" fill="#0088FE">
                      {valuationChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">
                What These Metrics Mean
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">
                    P/E Ratio: {data["P/E Ratio"]?.toFixed(2) || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getMetricExplanation("P/E Ratio")}
                    <span
                      className={`font-medium ${getMetricStatus("P/E Ratio", data["P/E Ratio"]) === "good" ? "text-green-500" : getMetricStatus("P/E Ratio", data["P/E Ratio"]) === "bad" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {getMetricStatus("P/E Ratio", data["P/E Ratio"]) ===
                      "good"
                        ? "Good"
                        : getMetricStatus("P/E Ratio", data["P/E Ratio"]) ===
                            "bad"
                          ? "Concerning"
                          : "Neutral"}{" "}
                      for your investment.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-medium">
                    P/B Ratio: {data["P/B Ratio"]?.toFixed(2) || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getMetricExplanation("P/B Ratio")}
                    <span
                      className={`font-medium ${getMetricStatus("P/B Ratio", data["P/B Ratio"]) === "good" ? "text-green-500" : getMetricStatus("P/B Ratio", data["P/B Ratio"]) === "bad" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {getMetricStatus("P/B Ratio", data["P/B Ratio"]) ===
                      "good"
                        ? "Good"
                        : getMetricStatus("P/B Ratio", data["P/B Ratio"]) ===
                            "bad"
                          ? "Concerning"
                          : "Neutral"}{" "}
                      for your investment.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profitability Tab */}
      {activeTab === "profitability" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Operating Margin"
              value={data["Operating Margin"]}
              format="percent"
            />
            <MetricCard
              title="Profit Margin"
              value={data["Profit Margin"]}
              format="percent"
            />
            <MetricCard
              title="Return on Equity (ROE)"
              value={data["Return on Equity (ROE)"]}
              format="percent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Margin Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profitabilityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Bar dataKey="value" fill="#00C49F">
                      {profitabilityChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">
                What These Metrics Mean
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">
                    Operating Margin: {formatPercent(data["Operating Margin"])}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getMetricExplanation("Operating Margin")}
                    <span
                      className={`font-medium ${getMetricStatus("Operating Margin", data["Operating Margin"]) === "good" ? "text-green-500" : getMetricStatus("Operating Margin", data["Operating Margin"]) === "bad" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {getMetricStatus(
                        "Operating Margin",
                        data["Operating Margin"]
                      ) === "good"
                        ? "Strong"
                        : getMetricStatus(
                              "Operating Margin",
                              data["Operating Margin"]
                            ) === "bad"
                          ? "Weak"
                          : "Average"}{" "}
                      operational efficiency.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-medium">
                    Profit Margin: {formatPercent(data["Profit Margin"])}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getMetricExplanation("Profit Margin")}
                    <span
                      className={`font-medium ${getMetricStatus("Profit Margin", data["Profit Margin"]) === "good" ? "text-green-500" : getMetricStatus("Profit Margin", data["Profit Margin"]) === "bad" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {getMetricStatus(
                        "Profit Margin",
                        data["Profit Margin"]
                      ) === "good"
                        ? "Strong"
                        : getMetricStatus(
                              "Profit Margin",
                              data["Profit Margin"]
                            ) === "bad"
                          ? "Weak"
                          : "Average"}{" "}
                      profitability.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Growth Tab */}
      {activeTab === "growth" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <MetricCard
              title="Revenue Growth"
              value={data["Revenue Growth"]}
              format="percent"
            />
            <MetricCard
              title="Earnings Growth"
              value={data["Earnings Growth"]}
              format="percent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">Growth Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Bar dataKey="value" fill="#FFBB28">
                      {growthChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4">
                What These Metrics Mean
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">
                    Revenue Growth: {formatPercent(data["Revenue Growth"])}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getMetricExplanation("Revenue Growth")}
                    <span
                      className={`font-medium ${getMetricStatus("Revenue Growth", data["Revenue Growth"]) === "good" ? "text-green-500" : getMetricStatus("Revenue Growth", data["Revenue Growth"]) === "bad" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {getMetricStatus(
                        "Revenue Growth",
                        data["Revenue Growth"]
                      ) === "good"
                        ? "Strong"
                        : getMetricStatus(
                              "Revenue Growth",
                              data["Revenue Growth"]
                            ) === "bad"
                          ? "Weak"
                          : "Moderate"}{" "}
                      top-line growth.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="font-medium">
                    Earnings Growth: {formatPercent(data["Earnings Growth"])}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getMetricExplanation("Earnings Growth")}
                    <span
                      className={`font-medium ${getMetricStatus("Earnings Growth", data["Earnings Growth"]) === "good" ? "text-green-500" : getMetricStatus("Earnings Growth", data["Earnings Growth"]) === "bad" ? "text-red-500" : "text-yellow-500"}`}
                    >
                      {" "}
                      {getMetricStatus(
                        "Earnings Growth",
                        data["Earnings Growth"]
                      ) === "good"
                        ? "Strong"
                        : getMetricStatus(
                              "Earnings Growth",
                              data["Earnings Growth"]
                            ) === "bad"
                          ? "Weak"
                          : "Moderate"}{" "}
                      bottom-line growth.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Summary */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Investment Summary</h2>
        <p className="text-gray-700">
          {data["Company Name"]} shows
          {getMetricStatus("Profit Margin", data["Profit Margin"]) === "good"
            ? " strong"
            : getMetricStatus("Profit Margin", data["Profit Margin"]) === "bad"
              ? " weak"
              : " average"}{" "}
          profitability with
          {data["Profit Margin"]
            ? ` a ${(data["Profit Margin"] * 100).toFixed(2)}% profit margin`
            : ""}
          .
          {getMetricStatus("P/E Ratio", data["P/E Ratio"]) === "good"
            ? " Valuation appears reasonable"
            : getMetricStatus("P/E Ratio", data["P/E Ratio"]) === "bad"
              ? " Valuation appears elevated"
              : " Valuation is moderate"}
          with a P/E ratio of {data["P/E Ratio"]?.toFixed(2) || "N/A"}. Growth
          is{" "}
          {getMetricStatus("Revenue Growth", data["Revenue Growth"]) === "good"
            ? "robust"
            : getMetricStatus("Revenue Growth", data["Revenue Growth"]) ===
                "bad"
              ? "sluggish"
              : "moderate"}
          with{" "}
          {data["Revenue Growth"]
            ? `${(data["Revenue Growth"] * 100).toFixed(2)}% revenue growth`
            : "moderate revenue growth"}
          . Analysts are{" "}
          {data["Analyst Recommendation Mean"] < 2.5
            ? "generally positive"
            : data["Analyst Recommendation Mean"] < 3.5
              ? "neutral"
              : "generally negative"}{" "}
          on the stock with a consensus{" "}
          {data["Analyst Recommendation Key"] || "hold"} rating.
        </p>
      </div>
    </div>
  );
};

export default StockMetricsDashboard;
