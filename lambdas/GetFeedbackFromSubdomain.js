const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received event: " + JSON.stringify(event));

  if (event.queryStringParameters && event.queryStringParameters.subdomain) {
    console.log("Received subdomain: " + event.queryStringParameters.subdomain);
    const params = {
      TableName: "EphemeralFeedback",
      KeyConditionExpression: "subdomain = :sub",
      ExpressionAttributeValues: {
        ":sub": event.queryStringParameters.subdomain,
      },
    };
    try {
      const data = await ddb.query(params).promise();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback: data.Items[0].feedback,
        }),
      };
    } catch (error) {
      return {
        statusCode: 404,
        body: JSON.stringify("No such subdomain found!"),
      };
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify("No subdomain given!"),
    };
  }
};
