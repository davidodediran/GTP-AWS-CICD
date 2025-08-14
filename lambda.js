import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ region: "us-east-1" });

export const handler = async (event) => {
  const city = event.queryStringParameters?.city;
  if (!city) {
    return { statusCode: 400, body: JSON.stringify({ error: "City parameter is required" }) };
  }

  const parameter = await ssmClient.send(
    new GetParameterCommand({ Name: "/App/API_KEY", WithDecryption: true })
  );

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${parameter.Parameter.Value}`
  );

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(await response.json())
  };
};