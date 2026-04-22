import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../features/cart/cartSlice";
import { CheckoutSteps } from "./ShippingPage";

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [method, setMethod] = useState("Stripe");

  useEffect(() => {
    // Redirect back if no shipping address
    if (!cart.shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [cart, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(method));
    navigate("/placeorder");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <CheckoutSteps step={1} />
      <div className="card mt-6">
        <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["Stripe", "PayPal"].map((m) => (
            <label
              key={m}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m}
                checked={method === m}
                onChange={() => setMethod(m)}
                className="accent-blue-600"
              />
              <span className="font-medium">{m}</span>
            </label>
          ))}
          <button className="btn-primary w-full mt-2" type="submit">
            Continue to Review Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
