import "./global.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import { Navbar } from "./components/Navbar";
import SessionWrapper from "./SessionWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Theme>
            <Navbar />
            {children}
          </Theme>
        </SessionWrapper>
      </body>
    </html>
  );
}
