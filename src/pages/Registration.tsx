import { supabase } from "../supabase/supabase";
import { useState } from "react";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function signUpNewUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Create new user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
        },
      },
    });

    if (signUpError) {
      console.error("Error signing up:", signUpError.message);
      setErrorMessage(signUpError.message);
      return;
    }

    // Insert user data into users table
    const { user } = signUpData;
    if (user) {
      const { data: userData, error: userInsertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            full_name: fullName,
          },
        ]);

      if (userInsertError) {
        console.error("Error inserting user data:", userInsertError.message);
        setErrorMessage("Account created, but additional data failed to save.");
      } else {
        console.log("User registered and additional data saved successfully:", userData);
        setSuccessMessage("Account created! Please check your email to confirm your account.");
      }
    }
  }

  return (
    <div>
      <h1>Registration Page</h1>
      <form id="login-form" onSubmit={signUpNewUser}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default Registration;