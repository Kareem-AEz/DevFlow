import { ROUTES } from "./routes";

export const STATES = {
  DEFAULT_EMPTY: {
    title: "The silence is deafening",
    message:
      "It seems our digital halls are echoing with possibilities. Perhaps you'd like to fill this void with something brilliant?",
    button: {
      text: "Ask a question",
      href: ROUTES.HOME,
    },
  },

  DEFAULT_ERROR: {
    title: "Well, that's embarrassing",
    message:
      "Our servers are having what we like to call a 'moment of reflection.' Care to give them another chance to impress you?",
    button: {
      text: "Try again",
      href: ROUTES.HOME,
    },
  },

  EMPTY_QUESTION: {
    title: "Crickets... actual crickets",
    message:
      "The question board is surprisingly zen-like in its emptiness. Why not disturb this peaceful silence with your curiosity?",
    button: {
      text: "Ask a question",
      href: ROUTES.ASK_A_QUESTION,
    },
  },

  EMPTY_TAG: {
    title: "A blank canvas awaits",
    message:
      "Tags are like breadcrumbs for the intellectually hungry. Care to leave a trail for future wanderers?",
    button: {
      text: "Create a tag",
      href: ROUTES.TAGS,
    },
  },

  EMPTY_COLLECTION: {
    title: "Your personal library is on vacation",
    message:
      "Collections are where knowledge goes to be cherished. Start curating your digital anthology of wisdom.",
    button: {
      text: "Save a collection",
      href: ROUTES.COLLECTIONS,
    },
  },

  EMPTY_ANSWERS: {
    title: "This question is feeling quite lonely",
    message:
      "Somewhere, someone is desperately refreshing this page hoping for your insights. Don't leave them hanging.",
  },

  EMPTY_USERS: {
    title: "Welcome to the exclusive club of one",
    message:
      "You're either incredibly early to the party or fashionably late to your own launch. Either way, congratulations on being here.",
    button: {
      text: "Sign up",
      href: ROUTES.SIGN_UP,
    },
  },
};
