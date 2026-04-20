import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../services/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import SvgShowPassIcon from "../components/icon/SvgShowPassIcon";
import SvgHidePassIcon from "../components/icon/SvgHidePassIcon";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [userInfo, navigate]);

  const toggleShowPass = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmShowPass = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
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
          ].map(({ label, value, set, type }) => (
            <div key={label} className="relative">
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
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
