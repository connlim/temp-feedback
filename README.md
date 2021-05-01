# Temp Feedback

![Deploy to AWS SAM](https://github.com/connlim/temp-feedback/actions/workflows/actions.yaml/badge.svg)
![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=temp-feedback)

Website which creates temporary URLs to collect anonymous feedback from others.

## Design

### Frontend

The frontend is created with [Next.js](https://nextjs.org/). Requests are first received by the [index page](nextjs/pages/index.js) which returns the corresponding page based on the subdomain. The `www` subdomain returns the default [welcome page](nextjs/views/welcome.js), and all other subdomains return the [feedback page](nextjs/views/feedback.js).

### Backend

The backend is modelled in [template.yaml](template.yaml) as an [AWS SAM template](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html).

Each API endpoint is exposed by API Gateway which proxies the requests to lambda functions, which in turn access the data.

#### Database

Data is stored in a [DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) table. The `subdomain` attribute is used as the primary/hash key. The `feedback` attribute contains a list of feedback objects, and additional feedback is added by appending to this list.

The following is an example of an item in the table represented in JSON:

```json
{
  "subdomain": "test-subdomain",
  "createdAt": 1618669283,
  "feedback": [
    {
      "dateTime": 1618669341,
      "text": "This is a piece of feedback."
    },
    {
      "dateTime": 1618669504,
      "text": "This is another piece of feedback."
    }
  ]
}
```

## Usage

### Development

#### Frontend

```bash
cd nextjs/

# Intall dependencies
npm install 

# Start development server on http://localhost:8080
npm run dev

# Build for production
npm run build
npm run start
```

#### Backend

Run the following commands to set up a local development environment

```bash
# Create Docker volume for DynamoDB
docker volume create tempfeedback-db

# Create Docker network
docker network create tempfeedback-network

# Start DynamoDB container
docker run -d \
    --name tempfeedback-dynamodb \
    -v tempfeedback-db:/home/dynamodblocal \
    --network tempfeedback-network \
    -p 8000:8000 \
    -w /home/dynamodblocal \
    amazon/dynamodb-local \
    -jar DynamoDBLocal.jar -sharedDb -dbPath .

# Create TempFeedback table in DynamoDB
aws dynamodb create-table \
    --endpoint-url http://localhost:8000 \
    --table-name TempFeedback \
    --attribute-definitions AttributeName=subdomain,AttributeType=S \
    --key-schema AttributeName=subdomain,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Build and run SAM API locally
sam build
sam local start-api --docker-network tempfeedback-network
```

Note that you will need to rerun `sam build` after making changes to `template.yaml` or any of the lambda code.

Here is a list of endpoints in the local dev environment:
| Service | Endpoint |
| --- | --- |
| Next.js Site | http://www.localhost:8080 |
| SAM API | http://localhost:3000 |
| DynamoDB (from host)| http://localhost:8000|
| DynamoDB (from Docker network)| http://tempfeedback-dynamodb:8000|

### Production

#### Backend

These instructions assume that you are using non-Amazon nameservers for your API domain. If you are using Route 53, it is possible to automate the extra steps.

First ensure your AWS user has administrator access to the following:

- APIGateway
- CloudFormation
- DynamoDB
- EventBridge
- IAM
- Lambda
- S3

Then do the following:

1. Create an empty S3 bucket to which the SAM template and lambda functions will be uploaded. The same bucket can then be used for subsequent deployments
2. Create a certificate for your API's domain in [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) and copy the given certificate arn

You can now run the following commands 

```bash
sam validate

sam deploy \
    --stack-name <stack name> \
    --s3-bucket <existing bucket name> \
    --parameter-overrides \
    'APIDomainName=<domain name> APICertificateArn=<domain certificate arn>' \
    --capabilities CAPABILITY_IAM
```

After deploying the API with SAM, create a CNAME record for your custom API domain that points to the API Gateway regional domain name. The regional domain name can be acquired with `aws apigateway get-domain-names`. This only has to be done once after the initial creation of the stack (unless the stack has been deleted).
