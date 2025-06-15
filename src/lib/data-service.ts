import dbConnect from "./mongoose";

import User from "@/database/user.model";

export async function getUsers() {
  await dbConnect();

  const users = await User.find();

  return users;
}
