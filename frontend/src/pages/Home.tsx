
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';
// import { ArrowRight } from 'lucide-react';

// export const Home = () => {
//   const { isAuthenticated } = useAuthStore();

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="py-12">
//         <div className="text-center">
//           <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
//             <span className="block">Welcome to Our</span>
//             <span className="block text-blue-600">AI Fraud Transaction Detection</span>
//           </h1>
//           <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//             Experience the power of our application with secure authentication and personalized dashboard.
//           </p>
//           <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//             {!isAuthenticated ? (
//               <>
//                 <div className="rounded-md shadow">
//                   <Link
//                     to="/register"
//                     className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
//                   >
//                     Get started
//                   </Link>
//                 </div>
//                 <div className="mt-3 sm:mt-0 sm:ml-3">
//                   <Link
//                     to="/login"
//                     className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
//                   >
//                     Sign in
//                   </Link>
//                 </div>
//               </>
//             ) : (
//               <div className="rounded-md shadow">
//                 <Link
//                   to="/dashboard"
//                   className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
//                 >
//                   Go to Dashboard
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, BarChart, Shield, Zap} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block mb-2">Welcome to Our</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                AI Fraud Transaction Detection
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Experience the power of our application with secure authentication and personalized dashboard.
            </p>
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
              {!isAuthenticated ? (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gradient-to-r from-teal-200 to-blue-300 hover:from-teal-300 hover:to-blue-400 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-300 bg-gray-800 hover:bg-gray-700 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    >
                      Sign in
                    </Link>
                  </div>
                </>
              ) : (
                <div className="rounded-md shadow">
                  <Link
                    to="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gradient-to-r from-teal-200 to-blue-300 hover:from-teal-300 hover:to-blue-400 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-center mb-10">Why Choose Our Solution?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <Shield className="h-12 w-12 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-center mb-2">Advanced Security</h3>
                <p className="text-gray-400 text-center">
                  Our AI-powered system provides cutting-edge security to protect your transactions.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <Zap className="h-12 w-12 text-teal-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-center mb-2">Real-time Detection</h3>
                <p className="text-gray-400 text-center">
                  Instantly identify and prevent fraudulent activities with our real-time monitoring.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <BarChart className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-center mb-2">Insightful Analytics</h3>
                <p className="text-gray-400 text-center">
                  Gain valuable insights with our comprehensive analytics and reporting tools.
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};



