import { supabase } from "../supabase/supabase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function signInWithEmail(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    console.log("Attempting login...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      setErrorMessage("Incorrect email or password. Please try again.");
    } else {
      console.log("Login successful:");
      setErrorMessage("");
      navigate("/dashboard"); // Redirect on successful login
    }
  }

  return (
    <div>
      <h1>Balance Buddy</h1>
      <form id="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" onClick={signInWithEmail}>
          Login
        </button>
      </form>
      <Link to="/dashboard">To Dashboard</Link>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>
        Don't have an account? <Link to="/new-account">Click here</Link>
      </p>
    </div>
  );
}

export default Login;
