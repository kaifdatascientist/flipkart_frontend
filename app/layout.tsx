import { CartProvider } from "@/context/cardcontext";
import "./globals.css";

export const metadata = {
  title: "LoginExpress - Premium Store",
  description: "Shop the best products",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
