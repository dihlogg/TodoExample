import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';

export const metadata = {
  title: "Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}