import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../services/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    try {
      const data = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", value: name, set: setName, type: "text" },
            { label: "Email", value: email, set: setEmail, type: "email" },
            {
              label: "Password",
              value: password,
              set: setPassword,
              type: "password",
            },
            {
              label: "Confirm Password",
              value: confirm,
              set: setConfirm,
              type: "password",
            },
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
                required
              />
            </div>
          ))}
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
