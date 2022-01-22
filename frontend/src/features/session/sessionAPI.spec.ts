import { UserState, SessionRequest, SessionRequestData } from "./sessionSlice";
import {
  fetchUser,
  deleteUser,
  registerUser,
  accessMemberData,
} from "./sessionAPI";

describe("session API", () => {
  const sessionRequest: SessionRequest = {
    email: "test@case.com",
    password: "password",
    password_confirmation: "password",
  };
  const payload: SessionRequestData = {
    user: sessionRequest,
  };
  const initialUser: UserState = {
    id: 1,
    email: "test@case.com",
  };
  it("should handle registering a user", async () => {
    try {
      const initSession = await fetchUser(payload);
      await deleteUser(initSession.auth_token);
    } catch (error) {
      console.log("User could not be deleted.");
    } finally {
      const sessionState = await registerUser(payload);
      const user = sessionState.user as UserState;
      expect(user.email).toBe(initialUser.email);
    }
  });
  it("should fetch a user", async () => {
    const sessionState = await fetchUser(payload);
    const user = sessionState.user as UserState;
    expect(user.email).toBe(initialUser.email);
  });

  it("should be able to access member data ", async () => {
    try {
      await registerUser(payload);
    } catch (error) {
      console.log("User could not be registered.");
    } finally {
      const sessionState = await fetchUser(payload);
      const auth_token = sessionState.auth_token;
      const expectedMemberData = "If you see this, you're in!";
      const memberData = await accessMemberData(auth_token);
      expect(memberData.message).toBe(expectedMemberData);
    }
  });

  it("should handle deleting a user", async () => {
    const sessionState = await fetchUser(payload);
    const response = await deleteUser(sessionState.auth_token);
    const expectedResponse = 200;
    expect(response).toBe(expectedResponse);
  });
});
