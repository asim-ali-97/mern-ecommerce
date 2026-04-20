import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateProfileMutation,
  useGetProfileQuery,
} from "../services/authApiSlice";
import { useGetMyOrdersQuery } from "../services/ordersApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/ui/Spinner";
import Message from "../components/ui/Message";
import SvgShowPassIcon from "../components/icon/SvgShowPassIcon";
import SvgHidePassIcon from "../components/icon/SvgHidePassIcon";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: orders, isLoading: ordersLoading } = useGetMyOrdersQuery(
    undefined,
    { skip: userInfo?.isAdmin },
  );

  const toggleShowPass = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmShowPass = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirm)
      return toast.error("Passwords do not match");
    try {
      const data = await updateProfile({
        name,
        email,
        password: password || undefined,
      }).unwrap();
      dispatch(setCredentials(data));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Update form */}
      <div className="card h-fit">
        <h2 className="text-xl font-bold mb-6">My Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", value: name, set: setName, type: "text" },
            { label: "Email", value: email, set: setEmail, type: "email" },
          ].map(({ label, value, set, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                className="input-field"
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
              />
            </div>
          ))}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              className="input-field pr-8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
            />
            {showPassword ? (
              <SvgHidePassIcon
                toggleShowPass={toggleShowPass}
                class_name="absolute top-10 right-3 z-10"
              />
            ) : (
              <SvgShowPassIcon
                toggleShowPass={toggleShowPass}
                class_name="absolute top-10 right-3 z-10"
              />
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              className="input-field pr-8"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              required
            />
            {showConfirmPassword ? (
              <SvgHidePassIcon
                toggleShowPass={toggleConfirmShowPass}
                class_name="absolute top-10 right-3 z-40 cursor-pointer bg-white"
              />
            ) : (
              <SvgShowPassIcon
                toggleShowPass={toggleConfirmShowPass}
                class_name="absolute top-10 right-3 z-40 cursor-pointer bg-white"
              />
            )}
          </div>
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Order history */}
      {!userInfo?.isAdmin && (
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">My Orders</h2>
          {ordersLoading ? (
            <Spinner />
          ) : orders?.length === 0 ? (
            <Message>No orders yet.</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["ID", "Date", "Total", "Paid", "Delivered", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-2 text-gray-500 font-medium"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 font-mono text-xs">
                        {order._id.slice(-8)}
                      </td>
                      <td className="py-3 px-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 font-medium">
                        ${order.totalPrice}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
