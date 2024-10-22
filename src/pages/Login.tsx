import { supabase } from "@supabase/auth-ui-shared";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithEmail(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    console.log("hello");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data);
    console.log(error);
  }

  return (
    <div>
      <h1>Login Page</h1>
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
        <button type="submit" onClick={(e) => signInWithEmail(e)}>
          Login
        </button>
      </form>
      <p>
        Dont't have an account? <Link to="new-account">Click here</Link>
      </p>
    </div>
  );
}

export default Login;
