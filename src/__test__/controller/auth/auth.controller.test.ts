import { FastifyRequest, FastifyReply } from "fastify";
import { AuthController } from "../../../controller/auth/auth.controller";
import { registerUser } from "../../../services/auth/signup.service";
import { loginUser } from "../../../services/auth/login.service";

// Mock the services
jest.mock("../../../services/auth/signup.service");
jest.mock("../../../services/auth/login.service");

describe("AuthController", () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      // Arrange
      const mockRequest = {
        body: {
          username: "testuser",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: { username: string; password: string } }>;

      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockUser = { _id: "userId123" };
      const mockToken = "token123";

      (registerUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      // Act
      await authController.register(mockRequest, mockResponse);

      // Assert
      expect(registerUser).toHaveBeenCalledWith("testuser", "testpassword");
      expect(mockResponse.code).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "User registered successfully",
        userId: mockUser._id,
        // token: mockToken, // Uncomment if token should be included
      });
    });

    it("should handle registration errors", async () => {
      // Arrange
      const mockRequest = {
        body: {
          username: "testuser",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: { username: string; password: string } }>;

      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      const error = new Error("Registration error");

      (registerUser as jest.Mock).mockRejectedValue(error);

      // Act
      await authController.register(mockRequest, mockResponse);

      // Assert
      expect(registerUser).toHaveBeenCalledWith("testuser", "testpassword");
      expect(mockResponse.code).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: "Registration failed",
        message: error,
      });
    });
  });

  describe("login", () => {
    it("should log in a user successfully", async () => {
      // Arrange
      const mockRequest = {
        body: {
          username: "testuser",
          password: "testpassword",
        },
      } as FastifyRequest<{ Body: { username: string; password: string } }>;

      const mockResponse = {
        send: jest.fn(),
      } as unknown as FastifyReply;

      const mockUser = { _id: "userId123" };
      const mockToken = "token123";

      (loginUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      // Act
      await authController.login(mockRequest, mockResponse);

      // Assert
      expect(loginUser).toHaveBeenCalledWith("testuser", "testpassword");
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Login successful",
        userId: mockUser._id,
        token: mockToken,
      });
    });

    it("should handle login errors", async () => {
      // Arrange
      const mockRequest = {
        body: {
          username: "testuser",
          password: "wrongpassword",
        },
      } as FastifyRequest<{ Body: { username: string; password: string } }>;

      const mockResponse = {
        code: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as FastifyReply;

      (loginUser as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials")
      );

      // Act
      await authController.login(mockRequest, mockResponse);

      // Assert
      expect(loginUser).toHaveBeenCalledWith("testuser", "wrongpassword");
      expect(mockResponse.code).toHaveBeenCalledWith(401);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });
  });

  describe("getProfile", () => {
    it("should return the user profile", async () => {
      // Arrange
      const mockRequest = {
        userId: "userId123",
      } as any as FastifyRequest;

      const mockResponse = {
        send: jest.fn(),
      } as unknown as FastifyReply;

      // Act
      await authController.getProfile(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.send).toHaveBeenCalledWith({
        userId: "userId123",
        message: "Profile fetched successfully",
      });
    });
  });
});
