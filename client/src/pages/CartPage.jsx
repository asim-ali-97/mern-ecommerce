import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../features/cart/cartSlice";
import Message from "../components/ui/Message";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const location = useLocation();
  const emptyCart = location.state?.emptyCart;
  if (emptyCart) {
    toast.error("Add product to cart first.");
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } =
    useSelector((state) => state.cart);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty.{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Go shop
          </Link>
        </Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="card flex items-center gap-4">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link
                    to={`/products/${item._id}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <p className="text-blue-600 font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <select
                  className="input-field w-20"
                  value={item.qty}
                  onChange={(e) =>
                    dispatch(
                      addToCart({ ...item, qty: Number(e.target.value) }),
                    )
                  }
                >
                  {[...Array(Math.min(item.countInStock, 10)).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ),
                  )}
                </select>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card h-fit space-y-3">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>${itemsPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${shippingPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (15%)</span>
              <span>${taxPrice}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
            <button
              className="btn-primary w-full"
              onClick={() => navigate("/shipping")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
