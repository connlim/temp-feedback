const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received event: " + JSON.stringify(event));
  const body = JSON.parse(event.body);

  if (body && body.subdomain) {
    console.log("Received body: " + event.body);
    const params = {
      TableName: "EphemeralFeedback",
      Item: {
        subdomain: body.subdomain,
        createdAt: Date.now(),
        feedback: [],
      },
    };
    try {
      const data = await ddb.put(params).promise();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.Item),
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
