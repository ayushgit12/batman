import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";

// Simulated Stock Data with Price Movement Simulation
const createStockSimulation = (initialPrice) => {
  let currentPrice = initialPrice;
  return () => {
    // Simulate price volatility
    const volatility = 0.005; // 0.5% daily volatility
    const randomFactor = Math.random() * 2 * volatility - volatility;
    currentPrice *= 1 + randomFactor;
    return Math.max(0.01, currentPrice); // Ensure price never goes below 0.01
  };
};

// Initial Stock Catalog with Price Generators
const STOCK_CATALOG = {
  AAPL: {
    name: "Apple Inc.",
    sector: "Technology",
    getPriceUpdate: createStockSimulation(175.5),
    initialPrice: 175.5,
    logo: "🍎",
  },
  GOOGL: {
    name: "Alphabet Inc.",
    sector: "Technology",
    getPriceUpdate: createStockSimulation(120.75),
    initialPrice: 120.75,
    logo: "🔍-",
  },
  MSFT: {
    name: "Microsoft Corporation",
    sector: "Technology",
    getPriceUpdate: createStockSimulation(335.2),
    initialPrice: 335.2,
    logo: "🪟",
  },
  AMZN: {
    name: "Amazon.com Inc.",
    sector: "E-commerce",
    getPriceUpdate: createStockSimulation(145.3),
    initialPrice: 145.3,
    logo: "🛒",
  },
  TSLA: {
    name: "Tesla, Inc.",
    sector: "Automotive",
    getPriceUpdate: createStockSimulation(240.6),
    initialPrice: 240.6,
    logo: "🚗",
  },
};

// Utility Functions
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const AdvancedPaperTradingApp = () => {
  // State Management
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState({});
  const [stockPrices, setStockPrices] = useState({});
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // Real-time Price Updates
  useEffect(() => {
    // Initial price setting
    const initialPrices = Object.fromEntries(
      Object.entries(STOCK_CATALOG).map(([symbol, stock]) => [
        symbol,
        stock.initialPrice,
      ])
    );
    setStockPrices(initialPrices);

    // Set up price update interval
    const priceUpdateInterval = setInterval(() => {
      const newPrices = Object.fromEntries(
        Object.entries(STOCK_CATALOG).map(([symbol, stock]) => [
          symbol,
          stock.getPriceUpdate(),
        ])
      );
      setStockPrices(newPrices);
    }, 1000); // Update every second for demonstration

    // Cleanup interval on component unmount
    return () => clearInterval(priceUpdateInterval);
  }, []);

  // Trade Execution Logic
  const executeStockTrade = (type = "buy") => {
    const currentPrice = stockPrices[selectedStock];
    const totalTransactionValue = currentPrice * tradeQuantity;

    // Validation checks
    if (type === "buy" && totalTransactionValue > balance) {
      setErrorMessage("Insufficient funds for purchase");
      return;
    }

    if (type === "sell") {
      const currentHolding = portfolio[selectedStock];
      if (!currentHolding || currentHolding.quantity < tradeQuantity) {
        setErrorMessage("Insufficient stocks to sell");
        return;
      }
    }

    // Update portfolio and balance
    setPortfolio((prevPortfolio) => {
      const updatedPortfolio = { ...prevPortfolio };

      if (type === "buy") {
        // Calculate new average price for the stock
        const existingHolding = updatedPortfolio[selectedStock] || {
          quantity: 0,
          avgPrice: 0,
        };
        const newTotalQuantity = existingHolding.quantity + tradeQuantity;
        const newAvgPrice =
          (existingHolding.avgPrice * existingHolding.quantity +
            currentPrice * tradeQuantity) /
          newTotalQuantity;

        updatedPortfolio[selectedStock] = {
          name: STOCK_CATALOG[selectedStock].name,
          quantity: newTotalQuantity,
          avgPrice: newAvgPrice,
        };
        setBalance((prev) => prev - totalTransactionValue);
      } else {
        // Selling logic
        updatedPortfolio[selectedStock].quantity -= tradeQuantity;

        // Remove stock if quantity becomes zero
        if (updatedPortfolio[selectedStock].quantity === 0) {
          delete updatedPortfolio[selectedStock];
        }
        setBalance((prev) => prev + totalTransactionValue);
      }

      return updatedPortfolio;
    });

    // Clear any previous error
    setErrorMessage("");
  };

  // Computed Portfolio Metrics
  const portfolioMetrics = useMemo(() => {
    const totalValue = Object.entries(portfolio).reduce(
      (total, [symbol, holding]) => {
        return total + holding.quantity * stockPrices[symbol];
      },
      0
    );

    return {
      totalValue,
      holdings: Object.entries(portfolio).map(([symbol, holding]) => ({
        symbol,
        ...holding,
        currentPrice: stockPrices[symbol],
        currentTotalValue: holding.quantity * stockPrices[symbol],
        profitLoss: (stockPrices[symbol] - holding.avgPrice) * holding.quantity,
      })),
    };
  }, [portfolio, stockPrices]);

  // Price Change Calculation
  const calculatePriceChange = (symbol) => {
    const stock = STOCK_CATALOG[symbol];
    const currentPrice = stockPrices[symbol];
    const priceChange = currentPrice - stock.initialPrice;
    const percentChange = (priceChange / stock.initialPrice) * 100;

    return {
      absolute: priceChange,
      percentage: percentChange,
    };
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mt-16 mx-auto p-6 bg-white shadow-2xl rounded-2xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Paper Trading Platform
          </h1>
          <p className="text-gray-600">Real-time Stock Trading Simulation</p>
        </header>

        {/* Account Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-100 p-6 rounded-xl">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Cash Balance
            </h3>
            <div className="flex items-center justify-center text-green-600">
              <span className="mr-2">💰</span>
              <span className="text-2xl font-bold">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Gain/Loss
            </h3>
            <div className="flex items-center justify-center text-blue-600">
              <span className="mr-2">📈</span>
              <span className="text-2xl font-bold">
                {formatCurrency(portfolioMetrics.totalValue)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Portfolio Value
            </h3>
            <div className="flex items-center justify-center">
              {portfolioMetrics.totalValue - balance > 0 ? (
                <span className="mr-2 text-green-500">▲</span>
              ) : (
                <span className="mr-2 text-red-500">▼</span>
              )}
              <span
                className={`text-2xl font-bold ${
                  portfolioMetrics.totalValue - balance > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(Math.abs(portfolioMetrics.totalValue - balance))}
              </span>
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Stock Selection & Price */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Stock Selection
            </h3>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              {Object.entries(STOCK_CATALOG).map(([symbol, stock]) => (
                <option key={symbol} value={symbol}>
                  {stock.logo} {symbol} - {stock.name}
                </option>
              ))}
            </select>

            {/* Current Stock Details */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold">
                  {selectedStock} Current Price
                </span>
                {calculatePriceChange(selectedStock).absolute > 0 ? (
                  <span className="text-green-500">▲</span>
                ) : (
                  <span className="text-red-500">▼</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {formatCurrency(stockPrices[selectedStock])}
                </span>
                <span
                  className={`font-semibold ${
                    calculatePriceChange(selectedStock).percentage > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {calculatePriceChange(selectedStock).percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Trade Execution */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Trade Execution
            </h3>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">
                Quantity to Trade
              </label>
              <input
                type="number"
                min="1"
                value={tradeQuantity}
                onChange={(e) =>
                  setTradeQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => executeStockTrade("buy")}
                className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
              >
                📈 Buy
              </button>
              <button
                onClick={() => executeStockTrade("sell")}
                className={`flex-1 ${
                  portfolio[selectedStock]?.quantity > 0
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white p-3 rounded-lg transition flex items-center justify-center`}
                disabled={!(portfolio[selectedStock]?.quantity > 0)}
              >
                📉 Sell
              </button>
            </div>
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Current Portfolio Holdings
          </h2>
          {portfolioMetrics.holdings.length === 0 ? (
            <p className="text-center text-gray-600">No stocks in portfolio</p>
          ) : (
            <div className="space-y-4">
              {portfolioMetrics.holdings.map((holding) => (
                <div
                  key={holding.symbol}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {holding.symbol} - {holding.name}
                    </h3>
                    <p className="text-gray-600">
                      Quantity: {holding.quantity}| Avg. Purchase Price:{" "}
                      {formatCurrency(holding.avgPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      Current Value: {formatCurrency(holding.currentTotalValue)}
                    </p>
                    <p
                      className={`font-bold ${
                        holding.profitLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {holding.profitLoss >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(holding.profitLoss))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedPaperTradingApp;