// "use client";;
// import { cn } from "@/lib/utils";
// import React from "react";

// export const AuroraBackground = ({
//   className,
//   children,
//   showRadialGradient = true,
//   ...props
// }) => {
//   return (
//     <main>
//       <div
//         className={cn(
//           "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900",
//           className
//         )}
//         {...props}>
//         <div
//           className="absolute inset-0 overflow-hidden"
//           style={
//             {
//               "--aurora":
//                 "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",

//               "--dark-gradient":
//                 "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",

//               "--white-gradient":
//                 "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

//               "--blue-300": "#93c5fd",
//               "--blue-400": "#60a5fa",
//               "--blue-500": "#3b82f6",
//               "--indigo-300": "#a5b4fc",
//               "--violet-200": "#ddd6fe",
//               "--black": "#000",
//               "--white": "#fff",
//               "--transparent": "transparent"
//             }
//           }>
//           <div
//             //   I'm sorry but this is what peak developer performance looks like // trigger warning
//             className={cn(
//               `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,
//               showRadialGradient &&
//                 `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
//             )}></div>
//         </div>
//         {children}
//       </div>
//     </main>
//   );
// };
"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-slate-100",
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            "--aurora":
              "repeating-linear-gradient(120deg,#6366f1_10%,#60a5fa_20%,#a78bfa_30%,#c084fc_40%,#3b82f6_50%)",

            "--dark-gradient":
              "repeating-linear-gradient(100deg,#0f172a_0%,#0f172a_7%,transparent_10%,transparent_12%,#0f172a_16%)",

            "--white-gradient":
              "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

            "--indigo": "#6366f1",
            "--blue": "#3b82f6",
            "--violet": "#a78bfa",
            "--pink": "#ec4899",
            "--black": "#0f172a",
            "--white": "#fff",
            "--transparent": "transparent",
          }}
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[20px] opacity-70 blur-[20px] [background-image:var(--white-gradient),var(--aurora)] [background-size:400%,_250%] [background-position:50%_50%,50%_50%] will-change-transform 
              [--aurora:repeating-linear-gradient(120deg,var(--indigo)_10%,var(--violet)_20%,var(--blue)_30%,var(--pink)_40%,var(--violet)_50%)] 
              [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] 
              [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] 
              after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
              after:[background-size:300%,_150%] after:[background-attachment:fixed] after:mix-blend-screen after:content-[""] 
              dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
