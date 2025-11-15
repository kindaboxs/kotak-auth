import { env } from "@/lib/env";

export const getValidEmailDomains = () => {
  const domains = [
    "gmail.com",
    "outlook.com",
    "yahoo.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
  ];

  if (env.NODE_ENV === "development") {
    domains.push("example.com", "test.com", "mail.com");
  }

  return domains;
};

export const getNormalizedName = (name: string) => {
  const normalized = name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\s'-]/gu, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return normalized;
};
