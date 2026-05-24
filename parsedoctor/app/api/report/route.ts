export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
  
    const code = searchParams.get("code");
  
    const credentials = Buffer.from(
      `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`
    ).toString("base64");
  
    const tokenResponse = await fetch(
      "https://www.warcraftlogs.com/oauth/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      }
    );
  
    const tokenData = await tokenResponse.json();
  
    const accessToken = tokenData.access_token;
  
    const graphqlQuery = {
      query: `
        query {
          reportData {
            report(code: "${code}") {
              title
              owner {
                name
              }
              fights {
                name
                difficulty
                kill
              }
            }
          }
        }
      `,
    };
  
    const reportResponse = await fetch(
      "https://www.warcraftlogs.com/api/v2/client",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      }
    );
  
    const reportData = await reportResponse.json();
  
    return Response.json(reportData);
  }