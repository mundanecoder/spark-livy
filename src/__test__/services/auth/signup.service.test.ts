// import DummUser from "../../model/UserModel";
// import { generateToken } from "../../utils/jwt";
// import { registerUser } from "";

import DummUser from "../../../model/UserModel";
import { registerUser } from "../../../services/auth/signup.service";
import { generateToken } from "../../../utils/jwt";

jest.mock("../../../model/UserModel");
jest.mock("../../../utils/jwt");

describe("Signup Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user and return a token", async () => {
    // Arrange
    const username = "test";
    const password = "password";
    const user = {
      _id: "123",
      username,
      password,
      save: jest.fn().mockResolvedValue(undefined),
    };
    const token = "token";
    (DummUser as unknown as jest.Mock).mockImplementation(() => user);
    (generateToken as jest.Mock).mockReturnValue(token);

    // Act
    const result = await registerUser(username, password);

    // Assert
    expect(DummUser).toHaveBeenCalledWith({ username, password });
    expect(user.save).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalledWith(user._id.toString());
    expect(result).toEqual({ user, token });
  });

  it("should throw an error if user registration fails", async () => {
    // Arrange
    const username = "test";
    const password = "password";
    const error = new Error("Registration failed");
    (DummUser as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error),
    }));

    // Act & Assert
    await expect(registerUser(username, password)).rejects.toThrow(error);
  });
});
