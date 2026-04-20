import {
  useGetAllOrdersQuery,
  useDeliverOrderMutation,
} from "../../services/ordersApiSlice";
import { Link } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import Message from "../../components/ui/Message";
import { toast } from "react-toastify";

const AdminOrdersPage = () => {
  const { data: orders, isLoading, isError } = useGetAllOrdersQuery();
  const [deliverOrder] = useDeliverOrderMutation();

  const deliverHandler = async (id) => {
    if (!window.confirm("Mark this order as delivered?")) return;
    try {
      await deliverOrder(id).unwrap();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || "Could not update order");
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Message type="error">Failed to load orders.</Message>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {[
                "ID",
                "Customer",
                "Date",
                "Total",
                "Paid",
                "Delivered",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-3 text-gray-500 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 font-mono text-xs">
                  {order._id.slice(-8)}
                </td>
                <td className="py-3 px-3">{order.user?.name || "Deleted"}</td>
                <td className="py-3 px-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-3 font-medium">${order.totalPrice}</td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {order.isDelivered ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn-secondary text-xs py-1 px-3"
                    >
                      View
                    </Link>
                    {!order.isDelivered && (
                      <button
                        className="text-xs py-1 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        onClick={() => deliverHandler(order._id)}
                      >
                        Deliver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
