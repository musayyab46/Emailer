
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // Get user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <h1 className="text-lg font-bold mb-2 sm:mb-0">Email Dashboard</h1>

      <div className="flex items-center gap-4 text-sm">
        <Link to="/">Schedule</Link>
        <Link to="/scheduled">Scheduled</Link>
        <Link to="/sent">Sent</Link>

        {/* Profile Section */}
        {user && (
          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold cursor-pointer"
            >
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md">
                <div className="px-3 py-2 border-b text-xs">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

