import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.success===false){
            setError(data.message)
          }else{
            navigate("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignIn</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          onChange={handleChange}
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          onChange={handleChange}
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg
         uppercase hover:opacity-95 disable:opacity-80"
        >
          SignIn
        </button>
      </form>
      <div className="flex">
        <p>Dont Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">SignUp</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
