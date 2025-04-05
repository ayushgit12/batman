import React from "react";

// Helper to format numbers (currency, large numbers, percentages)
const formatNumber = (num, type = "number") => {
  if (num === null || num === undefined || isNaN(num)) return "N/A";

  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    case "percent":
      return `${(num * 100).toFixed(2)}%`;
    case "large":
      if (Math.abs(num) >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
      if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
      if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
      if (Math.abs(num) >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    case "ratio":
      return num.toFixed(2);
    default:
      return typeof num === "number"
        ? num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : num;
  }
};

const InfoItem = ({ label, value, formatType = "number" }) => (
  <div className="py-2 px-3 flex justify-between items-center text-sm border-b border-gray-200 last:border-b-0">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800 font-semibold text-right">
      {value === "N/A" || value === null || value === undefined ? (
        "N/A"
      ) : formatType === "link" &&
        typeof value === "string" &&
        value.startsWith("http") ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        formatNumber(value, formatType)
      )}
    </span>
  </div>
);

const StockInfo = ({ data }) => {
  if (!data?.symbol) {
    return (
      <div className="p-4 text-center text-gray-500">
        No fundamental data available.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {data.longName || data.symbol} ({data.symbol})
        </h2>
        <p className="text-sm text-gray-600">
          {data.sector} | {data.industry} | {data.country}
        </p>
        {data.website && (
          <InfoItem label="Website" value={data.website} formatType="link" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Business Summary
        </h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          {data.longBusinessSummary || "No summary available."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Key Metrics
            </h3>
            <div className="border border-gray-200 rounded-md mb-6">
              <InfoItem
                label="Market Cap"
                value={data.marketCap}
                formatType="large"
              />
              <InfoItem
                label="Enterprise Value"
                value={data.enterpriseValue}
                formatType="large"
              />
              <InfoItem
                label="Current Price"
                value={data.currentPrice}
                formatType="currency"
              />
              <InfoItem
                label="52 Week High"
                value={data.fiftyTwoWeekHigh}
                formatType="currency"
              />
              <InfoItem
                label="52 Week Low"
                value={data.fiftyTwoWeekLow}
                formatType="currency"
              />
              <InfoItem
                label="Avg. Volume"
                value={data.averageVolume}
                formatType="large"
              />
              <InfoItem label="Beta" value={data.beta} formatType="ratio" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Valuation & Ratios
            </h3>
            <div className="border border-gray-200 rounded-md mb-6">
              <InfoItem
                label="Trailing P/E"
                value={data.trailingPE}
                formatType="ratio"
              />
              <InfoItem
                label="Forward P/E"
                value={data.forwardPE}
                formatType="ratio"
              />
              <InfoItem
                label="Price To Book"
                value={data.priceToBook}
                formatType="ratio"
              />
              <InfoItem
                label="EV/Revenue"
                value={data.enterpriseToRevenue}
                formatType="ratio"
              />
              <InfoItem
                label="EV/EBITDA"
                value={data.enterpriseToEbitda}
                formatType="ratio"
              />
              <InfoItem
                label="Dividend Yield"
                value={data.dividendYield}
                formatType="percent"
              />
              <InfoItem
                label="Payout Ratio"
                value={data.payoutRatio}
                formatType="percent"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Financials & Growth
            </h3>
            <div className="border border-gray-200 rounded-md mb-6">
              <InfoItem
                label="Total Revenue"
                value={data.totalRevenue}
                formatType="large"
              />
              <InfoItem
                label="Revenue Per Share"
                value={data.revenuePerShare}
                formatType="ratio"
              />
              <InfoItem
                label="Revenue Growth (YoY)"
                value={data.revenueGrowth}
                formatType="percent"
              />
              <InfoItem
                label="Earnings Growth (YoY)"
                value={data.earningsGrowth}
                formatType="percent"
              />
              <InfoItem
                label="Gross Margins"
                value={data.grossMargins}
                formatType="percent"
              />
              <InfoItem
                label="Operating Margins"
                value={data.operatingMargins}
                formatType="percent"
              />
              <InfoItem
                label="Profit Margins"
                value={data.profitMargins}
                formatType="percent"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Balance Sheet
            </h3>
            <div className="border border-gray-200 rounded-md mb-6">
              <InfoItem
                label="Total Cash"
                value={data.totalCash}
                formatType="large"
              />
              <InfoItem
                label="Total Cash Per Share"
                value={data.totalCashPerShare}
                formatType="ratio"
              />
              <InfoItem
                label="Total Debt"
                value={data.totalDebt}
                formatType="large"
              />
              <InfoItem
                label="Book Value Per Share"
                value={data.bookValue}
                formatType="ratio"
              />
              <InfoItem
                label="Return on Assets"
                value={data.returnOnAssets}
                formatType="percent"
              />
              <InfoItem
                label="Return on Equity"
                value={data.returnOnEquity}
                formatType="percent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;