import React, { useState } from "react";
import { Notification } from '../common/Notification';
import { ErrorNotification } from "../common/ErrorNotification";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorNotificationMessage, setErrorNotificationMessage] = useState('');


  const navigate = useNavigate();

  const handleOtpSent = async () => {
    if (!otpSent)
      //  setOtpSent(true)

    try {
      const response = await fetch('/server/time_tracker_function/admin/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'OTP sent successfully!');
        setOtpSent(true); 
        setNotificationMessage('OTP sent successfully!');
        setShowNotification(true);
        
      } else {
        // alert('Failed to send OTP. Please try again.');
        setErrorNotificationMessage('Failed to send OTP!');
        setShowErrorNotification(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('An error occurred while sending OTP.');
    }
  }

  const handleValidateOtp = async () => {
    try {
      const response = await fetch('/server/time_tracker_function/admin/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || `OTP validated successfully! ${email}`);
        setNotificationMessage('OTP validated successfully!');
        setShowNotification(true);
        navigate('/PasswordReset', { state: { email } }); 

      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
       alert('An error occurred while validating OTP.');
      setErrorNotificationMessage('Failed to send OTP!');
      setShowErrorNotification(true);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch('/server/time_tracker_function/user/signup', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         // userName,
  //         // firstName,
  //         // lastName,
  //         // email,
  //         // password 
  //       }),
  //     });
      
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Signup failed');
  //     }

  //     // navigate('/otp', { state: { email } }); 
  //     // onBackToLogin(); 
  //   } catch (error) {
  //     console.error('Signup error:', error);
  //     setError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  return (
    <>
   
    <section className="h-screen bg-gray-200">
      <div className="container mx-auto py-5 h-full flex justify-center items-center">
        <div className="w-full max-w-md"> 
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col w-full h-full">
            <div className="w-full p-6 md:p-10 flex flex-col justify-center">
              <div className="text-center mb-6">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  alt="logo"
                  className="mx-auto w-32"
                />
                <h4 className="mt-4 mb-5 text-lg font-semibold text-gray-700">
                  We are The Fristine Team
                </h4>
              </div>
              <form className="flex flex-col justify-center">
                <p className="mb-4 text-gray-600">Enter Your Email to reset password</p>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Id
                  </label>
                  <input
                    type="email"
                    id="username"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email address"
                  />
                </div>
                {otpSent && (
                  <div className="mb-4">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter OTP"
                    />
                  </div>
                )}
                <div className="text-center">
                  <button
                    type="button"
                    className="w-full py-2 mb-3 text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-md shadow-lg hover:shadow-xl transition duration-300"
                    onClick={otpSent ? handleValidateOtp : handleOtpSent}
                  >
                    {otpSent ? "Validate OTP" : "Send Otp"}
                  </button>
                  <a
                    href="#!"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Login Page
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Notification
            message={notificationMessage}
            isVisible={showNotification}
            onClose={() => setShowNotification(false)}
          />
    <ErrorNotification
      message={errorNotificationMessage}
      isVisible={showErrorNotification}
      onClose={() => setShowErrorNotification(false)}
    />
    </>

    
  );

}