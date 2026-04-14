import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const totalItems = cartItems.reduce((a, i) => a + i.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-blue-600">
          PUNAR
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-600 transition-colors"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                {userInfo.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
