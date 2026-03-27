import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          {/* <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            SGAMS
          </h1> */}
          <img src={logo} className="w-16 h-13 rounded-full" />
          
        </div>

        <div className="flex items-center space-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-3 text-sm rounded-full font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
             
            alt="Hero" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        </div>
        
        <div className=" z-10 text-center px-6 max-w-4xl my-auto mx-auto">
          <h1 className="text-7xl lg:text-7xl font-black bg-linear-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 animate-fade-in-up">
            Student Group &<br />Assignment Mastery
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-2xl leading-relaxed opacity-90 ">
            Streamline group projects, track assignments, and collaborate seamlessly. 
            Built for students, groups, and admins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => navigate("/auth")}
              className="px-10 rounded-full py-4 text-lg font-semibold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 hover:scale-105 transform-gpu"
            >
              Start Free Today
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-10 py-4 text-lg font-semibold text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-gray-200 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-gray-300"
            >
              See Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl py-1 text-center bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 max-w-2xl mx-auto">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-20 leading-relaxed my-12">
            Powerful tools designed for modern student workflows.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-white/50 hover:border-blue-100">
              <div className="w-20 h-20 bg-linear-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl text-gray-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
                Group Management
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Create and manage student groups effortlessly with real-time updates and role assignments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-white/50 hover:border-purple-100 relative md:col-span-1">
              <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl text-gray-900 mb-4 text-center group-hover:text-purple-600 transition-colors">
                Assignment Tracking
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Track deadlines, submissions, and grades with automated notifications and progress analytics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-white/50 hover:border-indigo-100">
              <div className="w-20 h-20 bg-linear-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl text-gray-900 mb-4 text-center group-hover:text-indigo-600 transition-colors">
                Smart Dashboards
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Intuitive dashboards for students and admins with real-time insights and easy navigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl lg:text-3xl  mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students managing groups and assignments smarter.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-4xl px-12 py-5 text-xl font-bold text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/30 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linear-to-t from-slate-900 to-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SGAMS
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Streamlining student group and assignment management.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/auth" className="hover:text-white transition-colors">Login</a>
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="border-t border-gray-700 pt-6 text-xs text-gray-500">
            © 2024 SGAMS. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
