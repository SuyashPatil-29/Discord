import "./globals.css";
import { Open_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/modals/modal-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Discord",
  description: "Discord clone made using NextJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="discord-theme"
        >
          <Providers>
          <ModalProvider />
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
