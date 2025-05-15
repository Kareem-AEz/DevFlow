export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  QUESTION: (id: string) => `/question/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  COLLECTIONS: "/collections",
  ASK_A_QUESTION: "/ask-a-question",
  JOBS: "/jobs",
  COMMUNITIES: "/community",
};
