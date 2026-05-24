export async function GET() {
    const credentials = Buffer.from(
      `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`
    ).toString("base64");
  
    const response = await fetch("https://www.warcraftlogs.com/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });
  
    const data = await response.json();
  
    return Response.json(data);
  }