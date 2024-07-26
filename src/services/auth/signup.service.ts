import DummUser from "../../model/UserModel";
import { generateToken } from "../../utils/jwt";

export const registerUser = async (username: string, password: string) => {
  console.log("registerUser");
  const user = new DummUser({ username, password });
  await user.save();
  const token = generateToken((user._id as string).toString());
  return { user, token };
};
