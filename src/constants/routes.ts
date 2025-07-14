export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  QUESTION: (id: string) => `/questions/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  TAGS: "/tags",
  COLLECTIONS: "/collections",
  ASK_A_QUESTION: "/ask-a-question",
  JOBS: "/jobs",
  COMMUNITIES: "/community",
};
