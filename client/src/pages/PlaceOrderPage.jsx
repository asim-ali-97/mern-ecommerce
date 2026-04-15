import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCreateOrderMutation } from "../services/ordersApiSlice";
import { clearCart } from "../features/cart/cartSlice";
import { CheckoutSteps } from "./ShippingPage";
import Spinner from "../components/ui/Spinner";
import Message from "../components/ui/Message";
import { toast } from "react-toastify";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress?.address) navigate("/shipping");
    else if (!cart.paymentMethod) navigate("/payment");
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    try {
      const order = await createOrder({
        // we are mapping over the cartitems just because the cart items store images (array) but the order model expects image (single string) and the cart items use _id but the order model expects product (a reference to the product)
        orderItems: cart.cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.images[0], // ← array to single string
          price: item.price,
          product: item._id, // ← _id becomes product ref
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Could not place order");
    }
  };

  return (
    <div>
      <CheckoutSteps step={2} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Shipping */}
          <div className="card">
            <h2 className="text-lg font-bold mb-2">Shipping</h2>
            <p className="text-gray-600 text-sm">
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment */}
          <div className="card">
            <h2 className="text-lg font-bold mb-2">Payment Method</h2>
            <p className="text-gray-600 text-sm">{cart.paymentMethod}</p>
          </div>

          {/* Items */}
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="space-y-3">
              {cart.cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <Link
                    to={`/products/${item._id}`}
                    className="flex-1 text-sm hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <span className="text-sm text-gray-600">
                    {item.qty} × ${item.price.toFixed(2)} = $
                    {(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="card h-fit space-y-3">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <div className="flex justify-between text-sm">
            <span>Items</span>
            <span>${cart.itemsPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>${cart.shippingPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${cart.taxPrice}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${cart.totalPrice}</span>
          </div>
          {error && <Message type="error">{error?.data?.message}</Message>}
          <button
            className="btn-primary w-full"
            onClick={placeOrderHandler}
            disabled={isLoading || cart.cartItems.length === 0}
          >
            {isLoading ? <Spinner /> : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
