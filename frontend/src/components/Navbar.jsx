import { Link } from "react-router-dom";
import { LayoutDashboard, LineChart, Settings } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <LineChart className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">TradePro</span>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/order"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LineChart className="w-5 h-5" />
                Place Order
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">
                NIFTY 50
              </span>
              <span className="text-green-600 font-medium">
                19,201.45 +0.45%
              </span>
              <span className="text-sm font-medium text-gray-500">SENSEX</span>
              <span className="text-red-600 font-medium">63,284.19 -0.23%</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
