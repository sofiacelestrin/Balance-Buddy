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
    <>
      <header className="bg-blue-600 p-4 text-white">
        <div className="flex items-center">
          <img
            src="/src/1logo.svg"
            alt="Company Logo"
            className="h-12 w-auto mr-4"
          />
          <div className="text-4xl font-bold">Balance Buddy</div>
        </div>
      </header>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/src/1logo.svg"
            alt="Logo"
            className="mx-auto h-64 w-auto"
          />
          <h2 className="mt-10 text-center text-3xl font-bold tracking-tight text-gray-900">
            Login To Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            id="login-form"
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="mt-2 text-center text-sm text-red-500">{errorMessage}</p>
            )}

            <div>
              <button
                type="submit"
                onClick={signInWithEmail}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/new-account" className="font-semibold text-blue-600 hover:text-blue-500">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;

