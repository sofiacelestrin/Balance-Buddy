import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { Link } from "react-router-dom";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  async function signUpNewUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
  
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (signUpError) {
      console.error("Error signing up:", signUpError.message);
      setErrorMessage(signUpError.message);
      return;
    }
  
    const { user } = signUpData;
    const { data: userData, error: userInsertError } = await supabase
      .from("users")
      .insert([{ id: user?.id, full_name: fullName }]);
  
    if (userInsertError) {
      console.error("Error inserting user data:", userInsertError.message);
      setErrorMessage("Account created, but additional data failed to save.");
    } else {
      // Now add an entry in the meters table for this new user with all meters set to 100
      const { data: metersData, error: metersInsertError } = await supabase
        .from("meters")
        .insert([
          { user_id: user?.id, health: 100, self_actualization: 100, happiness: 100, social_connection: 100 },
        ]);
  
      if (metersInsertError) {
        console.error("Error inserting meters data:", metersInsertError.message);
        setErrorMessage("Account created, but error setting up meters.");
      } else {
        setSuccessMessage("Account created!");
      }
    }
  }
  

  useEffect(() => {
    if (!successMessage) return;

    const interval = setInterval(() => {
      setCountdown((count) => {
        if (count <= 1) {
          clearInterval(interval);
          navigate("/create-character");
          return count;
        }
        return count - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [successMessage, navigate]);

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
            Create Your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={signUpNewUser} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Account
            </button>

            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="mt-2 text-sm text-green-600">
                {successMessage}. Redirecting in {countdown} seconds...
              </p>
            )}
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">Sign in</Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Registration;


