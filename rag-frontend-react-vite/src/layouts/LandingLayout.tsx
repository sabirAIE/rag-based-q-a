import React, { useEffect, type JSX } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, User, Menu, X, BookOpen } from "lucide-react";
import { routeMap } from "../routes";
import { useAuth } from "../context/auth-context";

export default function LandingLayout(): JSX.Element {
  const navigate = useNavigate();
  const { role, logedIn, setLogedIn, setRole } = useAuth();

  useEffect(() => {
    if (!logedIn) {
      setRole("guest");
      navigate("/login", { replace: true });
    }
  }, [logedIn, navigate]);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const links = routeMap.filter((route) => route.roles.includes(role));

  const handleLogout = () => {
    setLogedIn(false);
    setRole("guest");
    localStorage.removeItem("token");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <React.Fragment>
      <nav className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Document Intelligence
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered document analysis and Q&A system
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {logedIn && (
              <>
                <button
                  onClick={() => handleLogout()}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 border-t pt-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {logedIn && (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <User size={20} />
                  Profile
                </Link>
                <button
                  onClick={() => handleLogout()}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <Outlet />
    </React.Fragment>
  );
}
