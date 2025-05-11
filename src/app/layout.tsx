import { Poppins } from "next/font/google";

import { generateMetadata } from "@/lib/metadata";

import "./globals.css";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	variable: "--font-poppins",
});

export const metadata = generateMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased`}>{children}</body>
		</html>
	);
}
