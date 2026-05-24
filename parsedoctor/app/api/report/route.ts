export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return Response.json({ error: "Missing report code" }, { status: 400 });
    }

    if (!process.env.WCL_CLIENT_ID || !process.env.WCL_CLIENT_SECRET) {
      return Response.json(
        { error: "Missing WarcraftLogs environment variables" },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(
      `${process.env.WCL_CLIENT_ID}:${process.env.WCL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch("https://www.warcraftlogs.com/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const tokenText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      return Response.json(
        { error: "Token request failed", details: tokenText },
        { status: 500 }
      );
    }

    const tokenData = JSON.parse(tokenText);
    const accessToken = tokenData.access_token;

    const graphqlQuery = {
      query: `
        query($code: String!) {
          reportData {
            report(code: $code) {
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
      variables: {
        code,
      },
    };

    const reportResponse = await fetch("https://www.warcraftlogs.com/api/v2/client", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });

    const reportText = await reportResponse.text();

    if (!reportResponse.ok) {
      return Response.json(
        { error: "Report request failed", details: reportText },
        { status: 500 }
      );
    }

    const reportData = JSON.parse(reportText);

    return Response.json(reportData);
  } catch (error) {
    return Response.json(
      {
        error: "Unexpected server error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}