import { generateNonce } from "siwe";
import {
  /*verifySignature,*/
  getAddressFromMessage,
  getChainIdFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";
import { executeQuery, getQuery } from "../../utils/db.js";
const projectId = process.env.WALLET_CONNECT_PROJECT_ID;

export const connect = async (req, res, next) => {
  try {
    // const user = await userService.createUser(req.body);
    res.status(201).json('Connected!');
  } catch (error) {
    next(error);
  }
};

export const nonce = (_, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(generateNonce());
}

// verify the message
export const verify = async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ error: "SiweMessage is undefined" });
    }

    // save the session with the address and chainId (SIWESession)
    const message = req.body.message;
    const signature = req.body.signature;
    const address = getAddressFromMessage(message);
    let chainId = getChainIdFromMessage(message);
    // req.session.siwe = { address, chainId };
    // req.session.save(() => res.status(200).send(true));

    // for the moment, the verifySignature is not working with social logins and emails  with non deployed smart accounts
    // for this reason we recommend using the viem to verify the signature
    const publicClient = createPublicClient({
      transport: http(
        `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`
      ),
    });
    const isValid = await publicClient.verifyMessage({
      message,
      address,
      signature,
    });


    if (!isValid) {
      // throw an error if the signature is invalid
      throw new Error("Invalid signature");
    }
    if (chainId.includes(":")) {
      chainId = chainId.split(":")[1];
    }
    
    // Convert chainId to a number
    chainId = Number(chainId);
    
    if (isNaN(chainId)) {
      throw new Error("Invalid chainId");
    }



    const query = `INSERT INTO users (wallet_address, chain_id, last_login)
       VALUES ($1, $2, NOW())
       ON CONFLICT (wallet_address, chain_id)
       DO UPDATE SET last_login = CURRENT_TIMESTAMP
       RETURNING id`
    const user_id = await getQuery(query, [address, chainId]);

    const createDirQuery = `
      INSERT INTO directory(user_id, name, parent_directory_id)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT 1 FROM directory
        WHERE user_id = $1 AND name = $2 AND parent_directory_id IS NOT DISTINCT FROM $3
      );
    `
    await executeQuery(createDirQuery, [user_id[0].id, '', null])

    // save the session with the address and chainId (SIWESession)
    req.session.siwe = { address, chainId };
    req.session.user_id = user_id[0].id;
    req.session.save(() => res.status(200).send(true));
  } catch (e) {
    // clean the session
    req.session.siwe = null;
    req.session.nonce = null;
    req.session.user_id = null;
    req.session.save(() => res.status(500).json({ message: e.message }));
  }
}

export const session = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(req.session.siwe);
}

export const signout = (req, res) => {
  // 1. Destroy the session server-side
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).send('Logout failed');
    }

    // 2. Clear the client-side cookie (must match original cookie settings)
    // res.clearCookie('shadow-vault', {
    //   domain: 'localhost', // Must match login cookie domain
    //   path: '/',
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    // });

    // 3. Send response
    res.status(200).send({ success: true });
  })
}

export const verifySession = (req, res) => {
  if (req.session.siwe?.address) {
    res.send({ "result": true })
  } else {
    res.send({ "result": false })
  }
}