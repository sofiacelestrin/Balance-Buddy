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
  
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  
    if (authError) {
      console.error("Login failed:", authError.message);
      setErrorMessage("Incorrect email or password. Please try again.");
    } else {
      console.log("Login successful:", authData);
      setErrorMessage("");
  
      // Check avatar_name in supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("avatar_name")
        .eq("id", authData.user?.id)
        .single();
  
      if (userError) {
        console.error("Failed to retrieve user data:", userError.message);
        setErrorMessage("An error occurred. Please try again.");
      } else if (!userData?.avatar_name) {
        // Redirect to character creation page if avatar_name is null
        navigate("/create-character");
      } else {
        // Redirect to dashboard if avatar_name exists
        navigate("/dashboard");
      }
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
