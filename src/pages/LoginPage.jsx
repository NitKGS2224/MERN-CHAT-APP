import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currState === "Sign Up" && !isDataSubmitted) {
      if (!fullName || !email || !password) {
        alert("Please fill all required fields");
        return;
      }
      setIsDataSubmitted(true);
      return;
    }

    // Prepare payload
    const payload = {
      fullName,
      email,
      password,
      bio: currState === "Sign Up" ? bio : undefined,
    };


    login(currState === "Sign Up" ? "signup" : "login", payload);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsDataSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left side */}
      <h1 className="text-9xl text-blue-500">CHAT APP</h1>

      {/* Right side form */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
        </h2>

        {/* Step 1 inputs */}
        {(!isDataSubmitted || currState === "Login") && (
          <>
            {currState === "Sign Up" && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="p-2 border border-gray-500 rounded-md focus:outline-none"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              required
            />
          </>
        )}

        {/* Step 2 input for Sign Up */}
        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            placeholder="Provide a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        )}

        <button
          type="submit"
          className="py-3 bg-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign Up"
            ? isDataSubmitted
              ? "Create Account"
              : "Next"
            : "Login Now"}
        </button>

       
        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                className="font-medium text-indigo-400 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  resetForm();
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Create an account{" "}
              <span
                className="font-medium text-indigo-400 cursor-pointer"
                onClick={() => {
                  setCurrState("Sign Up");
                  resetForm();
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
