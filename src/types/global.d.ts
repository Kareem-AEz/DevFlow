// Tag type
type Tag = {
  readonly _id: string;
  name: string;
};

// Author type
type author = {
  readonly _id: string;
  name: string;
  username?: string;
  image: string;
};

// Question type
type Question = {
  readonly _id: string;
  title: string;
  tags: Tag[];
  author: author;
  createdAt: Date;
  answers: number;
  upvotes: number;
  views: number;
};
