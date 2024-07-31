import DummUser from "../../model/UserModel";
import { generateToken } from "../../utils/jwt";

export const loginUser = async (username: string, password: string) => {
  console.log("test-start");

  const user = await DummUser.findOne({ username });

  console.log(user, "user123");
  if (!user) {
    console.log("isUserError");

    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    console.log("isMatchError");
    throw new Error("Invalid password");
  }

  const token = generateToken((user._id as string).toString());
  return { user, token };
};
