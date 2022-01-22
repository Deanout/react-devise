import sessionReducer, { SessionState } from "./sessionSlice";

describe("session reducer", () => {
  const initialState: SessionState = {
    user: {
      id: 0,
      email: "",
      created_at: "",
      updated_at: "",
    },
    auth_token: "",
  };
  it("should handle initial state", () => {
    expect(sessionReducer(undefined, { type: "unknown" })).toEqual({
      user: {
        id: 0,
        email: "",
      },
      auth_token: "",
    });
  });
  it("should handle setting a user", () => {
    const actual = sessionReducer(initialState, {
      type: "session/setUser",
      payload: {
        id: initialState.user.id,
        email: initialState.user.email,
        created_at: initialState.user.created_at,
        updated_at: initialState.user.updated_at,
      },
    });
    expect(actual.user).toEqual(initialState.user);
  });
  it("should handle setting an auth_token", () => {
    const actual = sessionReducer(initialState, {
      type: "session/setAuthToken",
      payload: "12345",
    });
    expect(actual.auth_token).toEqual("12345");
  });
});
