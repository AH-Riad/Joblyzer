import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  return (
    <div>
      <div>
        <div>
          <h2>Welcome to the Joblyzer</h2>
          <p>Sign in to post or apply for oppurtunities</p>
        </div>
        <div className="mt-10">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              <FaGithub className="w-6 h-6" />
              <span className="text-base font-medium">
                Continue with GitHub
              </span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              <FcGoogle className="w-6 h-6" />
              <span className="text-base font-medium">
                Continue with Google
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
