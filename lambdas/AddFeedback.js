const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received event: " + JSON.stringify(event));
  const body = JSON.parse(event.body);

  if (body && body.subdomain && body.feedback) {
    console.log("Received body: " + event.body);
    const newFeedback = { text: body.feedback, dateTime: Date.now() };
    const params = {
      TableName: "EphemeralFeedback",
      Key: {
        subdomain: body.subdomain,
      },
      ConditionExpression: "subdomain = :subdomain",
      UpdateExpression:
        "SET feedback = list_append(if_not_exists(feedback, :empty_list), :item)",
      ExpressionAttributeValues: {
        ":item": [newFeedback],
        ":empty_list": [],
        ":subdomain": body.subdomain,
      },
    };
    try {
      const data = await ddb.update(params).promise();
      console.log(data);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(newFeedback),
      };
    } catch (error) {
      console.log(error);
      if (error.code === "ConditionalCheckFailedException") {
        return {
          statusCode: 400,
          body: JSON.stringify("No such subdomain found!"),
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
      body: JSON.stringify("Invalid request!"),
    };
  }
};
