import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../features/cart/cartSlice";

const ShippingPage = () => {
  const { shippingAddress, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  useEffect(() => {
    if (cartItems.length == 0)
      navigate("/cart", { state: { emptyCart: true } });
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <CheckoutSteps step={0} />
      <div className="card mt-6">
        <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Address", value: address, set: setAddress },
            { label: "City", value: city, set: setCity },
            { label: "Postal Code", value: postalCode, set: setPostalCode },
            { label: "Country", value: country, set: setCountry },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                className="input-field"
                value={value}
                onChange={(e) => set(e.target.value)}
                required
              />
            </div>
          ))}
          <button className="btn-primary w-full" type="submit">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable checkout steps indicator
export const CheckoutSteps = ({ step }) => {
  const steps = ["Shipping", "Payment", "Place Order"];
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              i <= step ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                i <= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            {s}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-px ${i < step ? "bg-blue-600" : "bg-gray-300"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ShippingPage;
