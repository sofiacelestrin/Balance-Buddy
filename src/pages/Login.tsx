import { supabase } from "@supabase/auth-ui-shared";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  // This function allows Dashboard page to be accessed when login button is clicked regardless of user being logged in. This is done for testing purposes
  // until we get login functionality to work
  function handleLoginClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    navigate('/dashboard');
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
        <button type="submit" onClick={(e) => handleLoginClick(e)}>
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
