import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const onSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    const idToken = credentialResponse.credential;
    let config = {
      method: "post",
      url: `http://localhost:8080/google/auth?idToken=${idToken}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        const token = response.data;
        console.log("Received JWT token:", token);
        localStorage.setItem("jwtToken", token);
        navigate("/home");
      })
      .catch((error) => console.error("Error:", error));
  };

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <>
      <div className="h-screen bg-gradient-to-tr from-indigo-600 via-teal-900 to-[#351555] ">
        <div className="w-full max-w-5xl px-4 py-28 mx-auto space-y-8 ">
          <main className="grid min-h-0 items-center justify-center gap-4 px-4 text-center md:gap-10 lg:px-6 xl:gap-16">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold font-poppins  sm:text-5xl md:text-6xl text-slate-200">
                Welcome to the Board
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl lg:text-base xl:text-xl  font-inter">
                The easiest way to manage your tasks. Sign in with Google to get
                started.
              </p>
            </div>
          </main>
          <div className="flex flex-col justify-center items-center">
            <GoogleLogin
              shape="pill"
              size="large"
              type="circle"
              logo_alignment="left"
              onSuccess={onSuccess}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-gray-100 p-4 space-y-4 ">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">To Do</h2>
                <div className="flex space-x-1">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Tag1
                  </span>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                    Tag2
                  </span>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="relative group rounded-lg bg-white border p-4 cursor-move ">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r0:"
                    data-state="closed"
                    as="div"
                  >
                    <div className="text-sm font-semibold">
                      Research competitors
                    </div>
                    <div className="text-sm text-gray-500 underline ">
                      Add due date
                    </div>
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
                <div className="relative group rounded-lg bg-white border p-4 cursor-move ">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r1:"
                    data-state="closed"
                    as="div"
                  >
                    <div className="text-sm font-semibold">Write proposal</div>
                    <div className="text-sm text-gray-500 underline ">
                      Add due date
                    </div>
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 p-4 space-y-4 ">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">In Progress</h2>
              </div>
              <div className="grid gap-4">
                <div className="relative group rounded-lg bg-white border p-4 cursor-move ">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r2:"
                    data-state="closed"
                    as="div"
                  >
                    <div className="text-sm font-semibold">Wireframe app</div>
                    <div className="text-sm text-gray-500 underline ">
                      Add due date
                    </div>
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 p-4 space-y-4 ">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">Done</h2>
              </div>
              <div className="grid gap-4">
                <div className="relative group rounded-lg bg-white border p-4 cursor-move ">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r3:"
                    data-state="closed"
                    as="div"
                  >
                    <div
                      className="text-sm font-semibold
                    "
                    >
                      Design logo
                    </div>
                    <div className="text-sm text-gray-500 underline ">
                      Add due date
                    </div>
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;