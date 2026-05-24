const CLIENT_ID = process.env.WCL_CLIENT_ID!;
const CLIENT_SECRET = process.env.WCL_CLIENT_SECRET!;

export async function getAccessToken() {
  const response = await fetch("https://www.warcraftlogs.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await response.json();

  return data.access_token;
}