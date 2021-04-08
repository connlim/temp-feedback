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
        createdAt: Math.floor(Date.now() / 1000),
        feedback: [],
      },
      ConditionExpression: "attribute_not_exists(subdomain)",
    };
    try {
      const data = await ddb.put(params).promise();
      console.log(data);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.Item),
      };
    } catch (error) {
      console.log(error);
      if (error.code === "ConditionalCheckFailedException") {
        return {
          statusCode: 400,
          body: JSON.stringify("Subdomain already exists!"),
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify("Error adding feedback."),
        };
      }
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify("No subdomain given!"),
    };
  }
};
