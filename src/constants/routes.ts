export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITIES: "/community",
  COLLECTIONS: "/collections",
  JOBS: "/jobs",
  TAGS: (tag: string) => `/tags/${tag}`,
  ASK_A_QUESTION: "/ask-a-question",
  PROFILE: "/profile",
};
