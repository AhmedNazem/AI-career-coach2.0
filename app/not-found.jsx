// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import React from "react";

// const NotFound = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
//       <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
//       <h2 className="text-2xl font-semibold mb-4 text-cyan-100">
//         Page Not Found
//       </h2>
//       <p className="text-cyan-600 mb-8">
//         Oops! The page you&apos;re looking for doesn&apos;t exist or has been
//         moved
//       </p>
//       <Link href={"/"}>
//         <Button className="bg-cyan-100">Return Home:)</Button>
//       </Link>
//     </div>
//   );
// };

// export default NotFound;

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-bold ">
          <span className="inline-block animate-bounce gradient-title">4</span>
          <span className="inline-block animate-bounce animation-delay-200 gradient-title">
            0
          </span>
          <span className="inline-block animate-bounce animation-delay-400 gradient-title">
            4
          </span>
        </h1>
        <p className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300 mt-4 mb-8 ">
          Oops! Page not found
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-cyan-600 dark:bg-cyan-300 text-white dark:text-black rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-400 transition-colors duration-300"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
