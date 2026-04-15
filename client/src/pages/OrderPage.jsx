import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useCreatePaymentIntentMutation,
} from "../services/ordersApiSlice";
import Spinner from "../components/ui/Spinner";
import Message from "../components/ui/Message";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ order, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [payOrder] = usePayOrderMutation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        await payOrder({
          id: order._id, // ← order ID for the URL param
          paymentIntentId: paymentIntent.id, // ← renamed, no clash
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: order.user?.email || "",
        }).unwrap();
        toast.success("Payment successful!");
        onSuccess();
      } catch {
        toast.error("Payment confirmed but order update failed.");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        className="btn-primary w-full mt-4"
        disabled={!stripe || !elements || loading}
      >
        {loading ? "Processing..." : `Pay $${order.totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
};

const OrderPage = () => {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(id);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (order && !order.isPaid && !clientSecret) {
      const getSecret = async () => {
        try {
          const res = await createPaymentIntent({
            totalPrice: order.totalPrice,
          }).unwrap();
          setClientSecret(res.clientSecret);
        } catch (err) {
          console.error("Failed to create payment intent", err);
        }
      };
      getSecret();
    }
  }, [order]);

  if (isLoading) return <Spinner />;
  if (isError) return <Message type="error">Order not found.</Message>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order {order._id}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h2 className="text-lg font-bold mb-2">Shipping</h2>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message type="success">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </Message>
            ) : (
              <Message type="error">Not delivered yet</Message>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-2">Payment</h2>
            <p className="text-sm text-gray-600 mb-2">
              Method: {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message type="success">
                Paid on {new Date(order.paidAt).toLocaleDateString()}
              </Message>
            ) : (
              <Message type="error">Not paid yet</Message>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Items</h2>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <span className="flex-1 text-sm">{item.name}</span>
                  <span className="text-sm text-gray-600">
                    {item.qty} × ${item.price.toFixed(2)} = $
                    {(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="text-lg font-bold">Summary</h2>
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>

          {/* Stripe payment form */}
          {!order.isPaid && (
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Pay Now</h2>
              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: "stripe" } }}
                >
                  <CheckoutForm order={order} onSuccess={refetch} />
                </Elements>
              ) : (
                <Spinner />
              )}
            </div>
          )}

          {order.isPaid && <Message type="success">✓ Payment complete</Message>}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
