import { supabase } from "@supabase/auth-ui-shared";
import { useState } from "react";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  async function signUpNewUser() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          fullName,
          //here goes any other that is pertinent to our application purposes.
        },
      },
    });
  }

  return (
    <div>
      <h1>Registration Page</h1>

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
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Registration;
