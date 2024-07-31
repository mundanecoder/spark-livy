// jest.mock("")

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("Login Service", () => {
  it("should return a token", async () => {
    //arrangement
    const user = {
      _id: "123",
      username: "test",
      password: "password",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    const findOne = jest.fn().mockResolvedValue(user);
    const DummUser = { findOne };
    const generateToken = jest.fn().mockReturnValue("token");
    jest.doMock("../../../model/UserModel", () => DummUser);
    jest.doMock("../../../utils/jwt", () => ({ generateToken }));

    //act
    const { loginUser } = await import("../../../services/auth/login.service");
    const { token } = await loginUser("test", "password");

    //assert ()
    expect(token).toBe("token");
  });

  it("should throw an error if the user is not found", async () => {
    try {
      //arrangement

      const findOne = jest.fn().mockResolvedValue(null);
      const DummUser = { findOne };
      const generateToken = jest.fn().mockReturnValue("token");
      jest.doMock("../../../model/UserModel", () => DummUser);
      jest.doMock("../../../utils/jwt", () => ({ generateToken }));

      //act
      const { loginUser } = await import(
        "../../../services/auth/login.service"
      );
      const { token } = await loginUser("test", "password");
    } catch (error) {
      console.log(error, "test-error");
      expect(error).toBeTruthy();
    }

    //assert
  });

  it("should throw an error if the user is not found", async () => {
    try {
      //arrangement

      const user = {
        _id: "123",
        username: "test",
        password: "password",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      const findOne = jest.fn().mockResolvedValue(user);
      const DummUser = { findOne };
      const generateToken = jest.fn().mockReturnValue("token");
      jest.doMock("../../../model/UserModel", () => DummUser);
      jest.doMock("../../../utils/jwt", () => ({ generateToken }));

      //act
      const { loginUser } = await import(
        "../../../services/auth/login.service"
      );
      const { token } = await loginUser("test", "password");
    } catch (error) {
      console.log(error, "test-error");
      expect(error).toBeTruthy();
    }

    //assert
  });
});
