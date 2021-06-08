import * as Environment from "~/node_common/environment";

import { OAuth } from "oauth";

const initiateAuth = () =>
  new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    Environment.TWITTER_API_KEY,
    Environment.TWITTER_SECRET_API_KEY,
    "1.0",
    Environment.TWITTER_CALLBACK,
    "HMAC-SHA1"
  );

const getOAuthRequestToken = (OAuthProvider) => () =>
  new Promise((resolve, reject) => {
    OAuthProvider.getOAuthRequestToken((error, authToken, authSecretToken, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ authToken, authSecretToken, results });
    });
  });

const getOAuthAccessToken = (OAuthProvider) => ({ authToken, authSecretToken, authVerifier }) =>
  new Promise((resolve, reject) => {
    OAuthProvider.getOAuthAccessToken(
      authToken,
      authSecretToken,
      authVerifier,
      (error, authAccessToken, authSecretAccessToken, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ authAccessToken, authSecretAccessToken, results });
      }
    );
  });

const getProtectedResource = (OAuthProvider) => ({
  url,
  method,
  authAccessToken,
  authSecretAccessToken,
}) =>
  new Promise((resolve, reject) => {
    OAuthProvider.getProtectedResource(
      url,
      method,
      authAccessToken,
      authSecretAccessToken,
      (error, data, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ data, response });
      }
    );
  });

export const createOAuthProvider = () => {
  const auth = initiateAuth();
  auth.getProtectedResource;
  return {
    getOAuthRequestToken: getOAuthRequestToken(auth),
    getOAuthAccessToken: getOAuthAccessToken(auth),
    getProtectedResource: getProtectedResource(auth),
  };
};
