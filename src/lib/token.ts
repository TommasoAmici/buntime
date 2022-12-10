/**
 * @returns an API token compatible with the checks performed by the vscode-wakatime extension
 */
export const generateToken = (): string => {
  const token = "waka_" + crypto.randomUUID();
  if (
    // this regex is copied as is from vscode-wakatime, if the token generated doesn't
    // match, another one will be generated until it does
    token.match(
      /^(waka_)?[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    )
  ) {
    return token;
  } else {
    return generateToken();
  }
};

export const tokenFromBasicAuth = (basicAuth: string) => {
  const [_, base64Token] = basicAuth.split(" ", 2);
  return atob(base64Token);
};
