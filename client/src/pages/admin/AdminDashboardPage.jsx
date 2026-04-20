import { useGetAdminStatsQuery } from "../../services/ordersApiSlice";
import { Link } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import Message from "../../components/ui/Message";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const StatCard = ({ label, value, color, to }) => (
  <Link to={to} className="card hover:shadow-md transition-shadow block">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </Link>
);

const AdminDashboardPage = () => {
  const { data: stats, isLoading, isError } = useGetAdminStatsQuery();

  if (isLoading) return <Spinner />;
  if (isError) return <Message type="error">Failed to load stats.</Message>;

  const maxRevenue = Math.max(...stats.salesByMonth.map((m) => m.revenue), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          color="text-green-600"
          to="/admin/orders"
        />
        <StatCard
          label="Orders"
          value={stats.totalOrders}
          color="text-blue-600"
          to="/admin/orders"
        />
        <StatCard
          label="Products"
          value={stats.totalProducts}
          color="text-purple-600"
          to="/admin/products"
        />
        <StatCard
          label="Users"
          value={stats.totalUsers}
          color="text-orange-500"
          to="/admin/dashboard"
        />
      </div>

      {/* Sales chart */}
      <div className="card mb-10">
        <h2 className="text-lg font-bold mb-6">Monthly Revenue</h2>
        {stats.salesByMonth.length === 0 ? (
          <Message>No sales data yet.</Message>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {stats.salesByMonth.map((m) => (
              <div
                key={m._id}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-gray-500">
                  ${Math.round(m.revenue)}
                </span>
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 120}px` }}
                />
                <span className="text-xs text-gray-500">
                  {months[m._id - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          {stats.totalOrders > 0 && (
            <Link
              to="/admin/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              View all →
            </Link>
          )}
        </div>
        {stats.totalOrders > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {["Customer", "Date", "Total", "Paid", "Delivered"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-2 text-gray-500 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 px-2">
                    {order.user?.name || "Deleted user"}
                  </td>
                  <td className="py-2 px-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-2 font-medium">${order.totalPrice}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Message type="error">No Orders yet.</Message>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
