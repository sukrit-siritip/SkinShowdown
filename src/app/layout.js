import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Newsreader, Cinzel_Decorative } from "next/font/google";
import dynamic from "next/dynamic";
import ThemeProvider from "./theme-provider";
import "./globals.css";

const AgeGate = dynamic(() => import("@/components/age-gate"));

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  weight: ["700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "SkinShowdown",
  description: "Browse skins and cosmetics for Hunt: Showdown 1896.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${cinzelDecorative.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <ThemeProvider>
            <AgeGate />
            {children}
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
