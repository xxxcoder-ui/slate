import Storage from "node-storage";
import { createOAuthProvider } from "~/node_common/managers/twitter";

const storage = new Storage("file.txt");
export default async (req, res) => {
  try {
    const COOKIE_NAME = "oauth_token";
    const { getOAuthRequestToken } = createOAuthProvider();
    const { authToken, authSecretToken } = await getOAuthRequestToken();
    res.cookie(COOKIE_NAME, authToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    storage.put(authToken, authSecretToken);
    res.json({ authToken });
  } catch (e) {
    console.log("error", e);
    res.status(500).end();
  }
};
