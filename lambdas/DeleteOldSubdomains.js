const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Received event: " + JSON.stringify(event));

  let d = new Date();
  d.setDate(d.getDate() - 7);
  let cutoffTime = Math.floor(d.getTime() / 1000);

  try {
    // Get list of items to delete
    const scanParams = {
      TableName: "TempFeedback",
      ProjectionExpression: "subdomain",
      FilterExpression: "createdAt < :date",
      ExpressionAttributeValues: {
        ":date": cutoffTime,
      },
    };
    let items = [];
    let data = await ddb.scan(scanParams).promise();
    items.push(...data.Items);
    while (data.hasOwnProperty("LastEvaluatedKey")) {
      scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
      data = await ddb.scan(scanParams).promise();
      items.push(...data.Items);
    }
    console.log(items);

    // Delete items
    for (let i = 0; i < items.length; i += 25) {
      let deleteParams = {
        RequestItems: {
          TempFeedback: items.slice(i, i + 25).map((item) => {
            return {
              DeleteRequest: {
                Key: item,
              },
            };
          }),
        },
      };
      let data = await ddb.batchWrite(deleteParams).promise();
      console.log(data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
