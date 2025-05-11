import type { Metadata } from "next";

interface GenerateMetadataProps {
	title?: string;
	description?: string;
	image?: string;
	noIndex?: boolean;
	siteName?: string;
}

export function generateMetadata({
	title = "My Next.js App",
	description = "A boilerplate for Next.js applications",
	image = "/og-image.png",
	noIndex = false,
	siteName = "My Next.js App",
}: GenerateMetadataProps = {}): Metadata {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

	return {
		title: {
			default: title,
			template: `%s | ${siteName}`,
		},
		description,
		openGraph: {
			title,
			description,
			type: "website",
			url: baseUrl,
			images: [
				{
					url: `${baseUrl}${image}`,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`${baseUrl}${image}`],
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
			},
		},
		alternates: {
			canonical: baseUrl,
		},
	};
}
