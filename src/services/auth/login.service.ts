import DummUser from "../../model/UserModel";
import { generateToken } from "../../utils/jwt";

export const loginUser = async (username: string, password: string) => {
  const user = await DummUser.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken((user._id as string).toString());
  return { user, token };
};
