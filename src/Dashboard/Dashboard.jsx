import React from "react";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const baseurl = "http://13.233.161.217:8080";
  const navigate = useNavigate();
  const onSuccess = (credentialResponse) => {
    // console.log(credentialResponse);
    const idToken = credentialResponse.credential;
    let config = {
      method: "post",
      url: `${baseurl}/google/auth?idToken=${idToken}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        const token = response.data;
        // console.log("Received JWT token:", token);
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
      <div className="h-screen bg-zinc-900 ">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  ">
            <div className="rounded-lg bg-zinc-800 p-4 space-y-4 ">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">To Do</h2>
                <div className="flex space-x-1"></div>
              </div>
              <div className="grid gap-4">
                <div className="relative group rounded-lg bg-zinc-700 border p-4 cursor-move ">
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
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
                <div className="relative group rounded-lg bg-zinc-700 border p-4 cursor-move ">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r1:"
                    data-state="closed"
                    as="div"
                  >
                    <div className="text-sm font-semibold">Write proposal</div>
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800 p-4 space-y-4 ">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">In Progress</h2>
              </div>
              <div className="grid gap-4">
                <div className="relative group rounded-lg bg-zinc-700 border p-4 cursor-move ">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r2:"
                    data-state="closed"
                    as="div"
                  >
                    <div className="text-sm font-semibold">Wireframe app</div>
                  </button>
                  <div></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover:flex"></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-800 p-4 space-y-4 ">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold">Done</h2>
              </div>
              <div className="grid gap-4">
                <div className="relative group rounded-lg bg-zinc-700 border p-4 cursor-move ">
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
