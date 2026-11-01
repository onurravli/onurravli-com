/** Canonical origin; the apex domain redirects here (see next.config.ts). */
export const SITE_URL = "https://www.onurravli.com";

/** `onurravli.com`, for places that show the address rather than link it. */
export const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");

export const GITHUB_USERNAME = "onurravli";

export const CV_PATH = "/Onur_Ravli_CV.pdf";
