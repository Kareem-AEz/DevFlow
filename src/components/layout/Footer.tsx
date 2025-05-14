import React from "react";

import Link from "next/link";

const socialLinks = [
  {
    href: "https://github.com/",
    icon: "devicon-github-original",
    label: "GitHub",
  },
  {
    href: "https://twitter.com/",
    icon: "devicon-twitter-original",
    label: "Twitter",
  },
  {
    href: "https://linkedin.com/",
    icon: "devicon-linkedin-plain",
    label: "LinkedIn",
  },
];

const Footer = () => {
  return (
    <footer className="light-border background-light900_dark200 shadow-light-300 relative w-full border-t">
      {/* Top gradient border */}
      <div className="from-primary-500 to-primary-500 absolute top-0 left-0 h-1 w-full bg-gradient-to-r via-orange-400 opacity-80" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-12">
        {/* Left: Logo & tagline */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="size-7"
              src="/images/site-logo.svg"
              alt="DevFlow Logo"
            />
            <span className="h3-bold font-space-grotesk primary-text-gradient bg-clip-text text-transparent">
              DevFlow
            </span>
          </Link>
          <span className="text-dark-400 dark:text-light-700 mt-1 text-sm">
            Empowering developers to learn, share, and grow together.
          </span>
        </div>
        {/* Center: Links */}
        <nav className="text-body-regular text-dark-400 dark:text-light-700 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/about"
            className="hover:text-primary-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary-500 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="hover:text-primary-500 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-primary-500 transition-colors"
          >
            Terms
          </Link>
        </nav>
        {/* Right: Social icons */}
        <div className="mt-4 flex items-center justify-center gap-4 sm:mt-0">
          {socialLinks.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-primary-500 text-dark-400 dark:text-light-700 transition-transform"
            >
              <i className={`${icon} text-2xl`} />
            </a>
          ))}
        </div>
      </div>
      <div className="light-border text-dark-400 dark:text-light-700 background-light900_dark200 border-t pt-4 pb-2 text-center text-xs">
        &copy; {new Date().getFullYear()} DevFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
