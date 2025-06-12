const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="flex flex-col items-center space-y-8">
        {/* Enhanced Kanban-style cards animation */}
        <div className="relative w-56 h-32">
          <div className="flex justify-between w-full">
            {/* Card Column 1 - To Do */}
            <div className="flex flex-col space-y-2 items-center">
              <div className="w-4 h-1 bg-orange-400 rounded-full animate-pulse"></div>
              <div
                className="w-16 h-20 bg-white rounded-lg shadow-md border-l-4 border-orange-400 animate-pulse hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="p-2">
                  <div className="w-10 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-8 h-1 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div
                className="w-16 h-16 bg-white rounded-lg shadow-md border-l-4 border-orange-400 animate-pulse hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="p-2">
                  <div className="w-12 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-6 h-1 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>

            {/* Card Column 2 - In Progress */}
            <div className="flex flex-col space-y-2 items-center">
              <div
                className="w-4 h-1 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="w-16 h-24 bg-white rounded-lg shadow-md border-l-4 border-blue-500 animate-pulse hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="p-2">
                  <div className="w-11 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-9 h-1 bg-gray-100 rounded mb-1"></div>
                  <div className="w-6 h-1 bg-blue-200 rounded"></div>
                </div>
              </div>
              <div
                className="w-16 h-12 bg-white rounded-lg shadow-md border-l-4 border-blue-500 animate-pulse hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: "1.1s" }}
              >
                <div className="p-2">
                  <div className="w-10 h-2 bg-gray-200 rounded mb-1"></div>
                </div>
              </div>
            </div>

            {/* Card Column 3 - Done */}
            <div className="flex flex-col space-y-2 items-center">
              <div
                className="w-4 h-1 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="w-16 h-18 bg-white rounded-lg shadow-md border-l-4 border-green-500 animate-pulse hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: "0.9s" }}
              >
                <div className="p-2">
                  <div className="w-12 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-8 h-1 bg-gray-100 rounded mb-1"></div>
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div
                className="w-16 h-14 bg-white rounded-lg shadow-md border-l-4 border-green-500 animate-pulse hover:shadow-lg transition-shadow duration-300"
                style={{ animationDelay: "1.4s" }}
              >
                <div className="p-2">
                  <div className="w-11 h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center ml-auto">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow arrows */}
          <div
            className="absolute top-12 left-20 text-gray-300 animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
          <div
            className="absolute top-12 right-20 text-gray-300 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
        </div>

        {/* Enhanced loading spinner with orbital elements */}
        <div className="relative top-4">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-500 rounded-full animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          ></div>

          {/* Orbital dots */}
          <div
            className="absolute inset-0 w-16 h-16 animate-spin"
            style={{ animationDuration: "2.5s" }}
          >
            <div className="absolute w-2 h-2 bg-orange-400 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div
            className="absolute inset-0 w-16 h-16 animate-spin"
            style={{ animationDuration: "3s", animationDirection: "reverse" }}
          >
            <div className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full -bottom-0.5 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Enhanced loading text with typing effect */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-slate-700">
            Setting up the workspace...
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <div className="text-slate-500 font-medium overflow-hidden">
              <span className="inline-block animate-pulse">
                Syncing boards, tasks, and team data...
              </span>
            </div>
          </div>
          <div className="text-slate-500 text-sm">
            <span className="inline-block">
              This is hosted on a free-tier backend. If it was inactive, it may
              take up to a minute to spin back up.
            </span>
          </div>
        </div>

        {/* Enhanced progress indicators with icons */}
        <div className="flex space-x-12 text-center">
          <div className="flex flex-col items-center space-y-2 transform hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-600 font-medium">Projects</span>
            <div className="w-8 h-1 bg-green-500 rounded-full"></div>
          </div>

          <div className="flex flex-col items-center space-y-2 transform hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center animate-pulse shadow-sm">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-600 font-medium">Teams</span>
            <div className="w-8 h-1 bg-blue-300 rounded-full animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center space-y-2 transform hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-slate-500 animate-spin"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ animationDuration: "3s" }}
              >
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs text-slate-600 font-medium">Settings</span>
            <div
              className="w-8 h-1 bg-slate-300 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Enhanced background elements */}
      <div className="absolute inset-0 opacity-3 overflow-hidden">
        <div
          className="absolute top-10 left-10 w-40 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl transform rotate-12 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-36 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl transform -rotate-6 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-44 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl transform rotate-6 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl transform -rotate-12 animate-pulse"
          style={{ animationDelay: "5s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-50"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <style>{`
        @keyframes slideTask {
          0% {
            transform: translateX(0px) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateX(72px) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateX(144px) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: translateX(72px) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateX(0px) scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
