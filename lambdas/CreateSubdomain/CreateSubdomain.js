const AWS = require("aws-sdk");
const options = {};
if (process.env.AWS_SAM_LOCAL) {
  options.endpoint = "http://tempfeedback-dynamodb:8000";
}
const ddb = new AWS.DynamoDB.DocumentClient(options);

exports.handler = async (event) => {
  console.log("Received event: " + JSON.stringify(event));
  const body = JSON.parse(event.body);

  if (body && body.subdomain) {
    console.log("Received body: " + event.body);

    // Return error if subdomain name is invalid
    if (!/^[a-z0-9\-]*$/.test(body.subdomain)) {
      return {
        statusCode: 422,
        body: JSON.stringify("Invalid subdomain name!"),
      };
    }

    const params = {
      TableName: "TempFeedback",
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(params.Item),
      };
    } catch (error) {
      console.log(error);
      if (error.code === "ConditionalCheckFailedException") {
        return {
          statusCode: 409,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify("Subdomain already exists!"),
        };
      } else {
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify("Error adding feedback."),
        };
      }
    }
  } else {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify("No subdomain given!"),
    };
  }
};
