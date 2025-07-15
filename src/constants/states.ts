import { ROUTES } from "./routes";

export const STATES = {
  DEFAULT_EMPTY: {
    title: "No data found",
    message:
      "Looks like the database is taking a nap. Wake it up by asking a question.",
    button: {
      text: "Ask a question",
      href: ROUTES.HOME,
    },
  },

  DEFAULT_ERROR: {
    title: "Something went wrong",
    message: "Even our code can have a bad day. Please try again later.",
    button: {
      text: "Try again",
      href: ROUTES.HOME,
    },
  },

  EMPTY_QUESTION: {
    title: "No questions found",
    message:
      "Looks like there are no questions to display. Be the first to ask a question.",
    button: {
      text: "Ask a question",
      href: ROUTES.ASK_A_QUESTION,
    },
  },

  EMPTY_TAG: {
    title: "No tags found",
    message: "The tag cloud is empty. Add some keywords to make it rain.",
    button: {
      text: "Create a tag",
      href: ROUTES.TAGS,
    },
  },

  EMPTY_COLLECTION: {
    title: "Collections Are Empty",
    message:
      "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
    button: {
      text: "Save a collection",
      href: ROUTES.COLLECTIONS,
    },
  },

  EMPTY_ANSWERS: {
    title: "The Answer board is empty, make it rain 💦 with your answer!",
    message:
      "Looks like there are no answers to display. Be the first to answer.",
  },
};
