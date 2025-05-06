import type { Metadata } from "next";
import "@/styles/global.css";
import { headers } from 'next/headers'
import ContextProvider from "@/components/auth/ContextProvider";
import "@/utils/fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Toaster, ToasterProps } from 'sonner'

export const metadata: Metadata = {
  title: "Shadow Vault",
  description: "Your data, your power. Stored securely onchain — forever.",
};

config.autoAddCss = false;

const toastOptions = {
  classNames: {
    error:
      '!bg-danger !text-danger-text',
    success:
      '!bg-success !text-success-text',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster position="top-right" toastOptions={toastOptions} />
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
