import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { contarItems } = useCart();
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user, isAuthenticated, logout, authStateChanged } = useContext(AuthContext);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const count = contarItems();
    setCartItemCount(count);
  }, [contarItems]);

  useEffect(() => {
    // Puedes manejar efectos secundarios relacionados a auth si quieres
  }, [isAuthenticated, user, authStateChanged]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim() !== "") queryParams.append("q", searchQuery);
    navigate(`/productos?${queryParams.toString()}`);
  };

  const toggleMenu = () => {
    if (isAuthenticated) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      navigate("/iniciar-sesion");
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#FCF8E6]">
      <div className="w-full bg-[#003366] text-white py-1 px-4">
        <div className="max-w-[1170px] mx-auto flex justify-end">
          <div className="flex gap-4 text-sm">
            {isAuthenticated && user?.nombre ? (
              <>
                <span className="hover:text-gray-200 cursor-default">
                  Hola {user.nombre.split(" ")[0]}...
                </span>
                <span>|</span>
                <button
                  onClick={logout}
                  className="hover:text-gray-200 focus:outline-none"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/iniciar-sesion" className="hover:text-gray-200">
                  Iniciar sesión
                </Link>
                <span>|</span>
                <Link to="/registrarse" className="hover:text-gray-200">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1170px] mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 md:justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/images/logo/logo.png"
              alt="Toner Express"
              width={300}
              height={100}
              className="h-12 w-auto md:h-14"
            />
          </Link>

          <div className="w-full md:flex-grow md:max-w-xl md:mx-8">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="search"
                placeholder="Escriba su torner o tinta aquí..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Buscar"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.361 18.2168L14.601 13.2662C15.8249 11.8113 16.4954 9.98069 16.4954 8.07499C16.4954 3.62251 12.8729 0 8.42045 0C3.96797 0 0.345459 3.62251 0.345459 8.07499C0.345459 12.5275 3.96797 16.15 8.42045 16.15C10.092 16.15 11.6849 15.6458 13.0467 14.6888L17.8429 19.677C18.0434 19.8852 18.3113 20 18.602 20C18.8798 20 19.1404 19.8957 19.3382 19.7061C19.7649 19.2995 19.7775 18.6437 19.361 18.2168ZM8.42045 2.10652C11.7115 2.10652 14.3889 4.78391 14.3889 8.07499C14.3889 11.3661 11.7115 14.0435 8.42045 14.0435C5.12937 14.0435 2.45198 11.3661 2.45198 8.07499C2.45198 4.78391 5.12937 2.10652 8.42045 2.10652Z"
                    fill="#666666"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="flex items-center gap-6">
            <img
              src="/images/logo/KIOTLogo.png"
              alt="KIOT"
              width={127}
              height={43}
              className="h-14 w-auto hidden md:block"
            />
            <div className="flex items-center gap-4">
              {/* Icono de cuenta */}
              <div className="relative" ref={accountMenuRef}>
                {isAuthenticated ? (
                  <>
                    <UserCircleIcon
                      className="h-6 w-6 cursor-pointer"
                      onClick={toggleMenu}
                    />
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                        <Link
                          to="/mi-cuenta"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeMenu}
                        >
                          Mi cuenta
                        </Link>
                        {(user?.tipo === "Admin" ||
                          user?.tipo === "SuperAdmin") && (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            Administración
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            closeMenu();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/iniciar-sesion">
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                )}
              </div>
              <Link to="/carrito" className="relative">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-red-500 text-black rounded-full px-2 text-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="w-full bg-[#003366] text-white relative">
        <div className="max-w-[1170px] mx-auto px-4">
          <button
            className="md:hidden py-3 px-4 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <ul
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row absolute md:static left-0 right-0 bg-[#003366] md:bg-transparent z-50`}
          >
            <li className="px-6 py-3 hover:bg-[#004488] transition-colors border-b md:border-b-0 border-[#004488]">
              <Link to="/">Inicio</Link>
            </li>
            <li className="px-6 py-3 hover:bg-[#004488] transition-colors border-b md:border-b-0 border-[#004488]">
              <Link to="/quienes-somos">¿Quienes somos?</Link>
            </li>
            <li className="px-6 py-3 hover:bg-[#004488] transition-colors border-b md:border-b-0 border-[#004488]">
              <Link to="/productos">Productos</Link>
            </li>
            <li className="px-6 py-3 hover:bg-[#004488] transition-colors">
              <Link to="/contactanos/">Contáctanos</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
