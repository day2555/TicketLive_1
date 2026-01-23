// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/layout/Navbar";
// import { Footer } from "@/components/layout/Footer";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { CartProvider } from "@/contexts/CartContext";
// import { FavoritesProvider } from "@/contexts/FavoritesContext";
// import { TicketsProvider } from "@/contexts/TIcketsContext";
// import { Toaster } from "sonner";
// import { ChatBot } from "@/components/ui/ChatBot";
// import { Suspense } from "react";

// const inter = Inter({
//   variable: "--font-sans",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "TicketLive - Premium Concert Tickets",
//   description: "Secure tickets for the best live events, concerts, and festivals.",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className="dark">
//       <body
//         className={`${inter.variable} antialiased min-h-screen flex flex-col`}
//       >
//         <AuthProvider>
//           <CartProvider>
//             <FavoritesProvider>
//               <TicketsProvider>
//                 <Suspense fallback={null}>
//                   <Navbar />
//                   {children}
//                   <Footer />
//                   <Toaster position="top-right" richColors />
//                 </Suspense>
//               </TicketsProvider>
//             </FavoritesProvider>
//             <ChatBot />
//           </CartProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

//NUEVO
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Toaster } from "sonner";
import { ChatBot } from "@/components/ui/ChatBot";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketLive - Premium Concert Tickets",
  description: "Secure tickets for the best live events, concerts, and festivals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <Suspense fallback={null}>
                <Navbar />
                {children}
                <Footer />
                <Toaster position="top-right" richColors />
              </Suspense>
          <ChatBot />
        </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </body>
    </html >
  );
}
