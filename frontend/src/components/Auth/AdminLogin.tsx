import React from "react";
import { Link } from 'react-router-dom';
export function AdminLogin(){


  async function handleSubmit() {
    
  }

    return (
        <section className="h-screen bg-gray-200">
          <div className="container mx-auto py-5 h-full flex justify-center items-center">
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6 md:p-10">
                  <div className="text-center mb-6">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                      alt="logo"
                      className="mx-auto w-48"
                    />
                    <h4 className="mt-4 mb-5 text-xl font-semibold text-gray-700">
                      We are The Fristine Team
                    </h4>
                  </div>
                  <form>
                    <p className="mb-4 text-gray-600">Please login to your account</p>
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <input
                        type="email"
                        id="username"
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Phone number or email address"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="w-full py-2 mb-3 text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-md shadow-lg hover:shadow-xl transition duration-300"
                        onClick={handleSubmit}
                      >
                        Log in
                      </button>
                      {/* <a href="" className="text-sm text-gray-500 hover:text-gray-700">
                        Forgot password?
                      </a> */}
                       <Link to="/forgotPassword" className="text-sm text-gray-500 hover:text-gray-700">
            Forgot password?
        </Link>
                    </div>
                    {/* <div className="flex items-center justify-center mt-4">
                      <p className="text-sm text-gray-600 mr-2">Don't have an account?</p>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
                      >
                        Create new
                      </button>
                    </div> */}
                  </form>
                </div>
    
             
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white items-center justify-center p-10 rounded-r-lg">
                  <div>
                    <h4 className="text-2xl font-bold mb-4">We are more than just a company</h4>
                    <p className="text-sm text-justify">
                    Welcome to our Time Tracker Application, 
                    where efficiency meets simplicity. Our platform is designed to help
                     manage and track work hours seamlessly, empowering your team to stay
                      organized and productive.
                    </p>

                    <p className="text-sm mt-3"><b>Empower your team, streamline workflows, and take control of your organization's time management—all in one place</b></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
}