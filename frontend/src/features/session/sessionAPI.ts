import { UserState, SessionRequestData, SessionState } from "./sessionSlice";
import axios from "axios";
const BASE_URL = "http://localhost:3000/api/v1";

export function fetchUser(payload: SessionRequestData) {
  return new Promise<SessionState>((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users/sign_in`, payload)
      .then((response: any) => {
        const data = {
          user: {
            id: response.data.id,
            email: response.data.email,
          },
          auth_token: response.headers.authorization,
        };
        resolve(data);
      })
      .catch((error: any) => reject(error));
  });
}

export function registerUser(payload: SessionRequestData) {
  return new Promise<SessionState>((resolve, reject) => {
    axios
      .post(`${BASE_URL}/users`, payload)
      .then((response: any) => {
        const data = {
          user: response.data.user,
          auth_token: response.headers.authorization,
        };
        resolve(data);
      })
      .catch((error: any) => reject(error));
  });
}

export function deleteUser(payload: string) {
  const config: any = {
    headers: {
      Authorization: payload,
    },
  };
  return new Promise<string>((resolve, reject) => {
    axios
      .delete(`${BASE_URL}/users`, config)
      .then((response: any) => {
        resolve(response.status);
      })
      .catch((error: any) => reject(error));
  });
}

export function accessMemberData(auth_token: string) {
  const config: any = {
    headers: {
      Authorization: auth_token,
    },
  };
  return new Promise<any>((resolve, reject) => {
    axios
      .get(`${BASE_URL}/member-data`, config)
      .then((response: any) => {
        resolve(response.data);
      })
      .catch((error: any) => reject(error));
  });
}
