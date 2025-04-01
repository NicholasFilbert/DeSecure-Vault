import { SiweMessage } from "siwe";
import {
  type SIWESession,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs,
  createSIWEConfig,
  formatMessage,
} from "@reown/appkit-siwe";
const BASE_URL = "http://localhost:8000/api/auth";

/* Function that returns the user's session - this should come from your SIWE backend */
async function getSession() {
  const res = await fetch(BASE_URL + "/session", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }


  const data = await res.json();

  const isValidData =
    typeof data === "object" &&
    typeof data.address === "string" &&
    typeof data.chainId === "number";

  return isValidData ? (data as SIWESession) : null;
}

/* Use your SIWE server to verify if the message and the signature are valid */
const verifyMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
  try {
    const response = await fetch(BASE_URL + "/verify", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ message, signature }),
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result === true;
  } catch (error) {
    return false;
  }
};


const getNonce = async () => {
  const response = await fetch(BASE_URL + "/nonce", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  return await response.text();
}

const signOut =  async (): Promise<boolean> => {
  const res = await fetch(BASE_URL + "/signout", {
   method: "GET",
   credentials: 'include',
 });
  if (!res.ok) {
      throw new Error('Network response was not ok');
  }
 
  const data = await res.json();
  return data == "{}";
} 

const onSignIn = (session?: SIWESession) => {
  if(session) {
    window.location.replace('/app')
  }
}

/* Create a SIWE configuration object */
export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: window.location.host,
    uri: window.location.origin,
    chains: [1, 2020],
    statement: "Please sign with your account",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, address),

  getNonce: async () => {
    const nonce = await getNonce();

    if (!nonce) {
      throw new Error("Failed to get nonce!");
    }
    return nonce;
  },
  getSession,
  verifyMessage,
  signOut,
  onSignIn
});