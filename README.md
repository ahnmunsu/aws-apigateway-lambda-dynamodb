# aws-apigateway-lambda-dynamodb

POST Example
```js
console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();


exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {

        case 'POST':
            var params = {
                TableName: "AirMonitor",
                Item: JSON.parse(event.body)
            };
            dynamo.putItem(params, done);
            break;

        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
```

GET Example
```js
console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
//    console.log('Received event:', JSON.stringify(event, null, 2));
    var fromDate = '2019-01-01T00:00:00.000Z';
    var toDate = new Date().toISOString();
    
    if (event.queryStringParameters) {
        if (event.queryStringParameters.FromDateTime) {
            fromDate = event.queryStringParameters.FromDateTime;
        }
        
        if (event.queryStringParameters.ToDateTime) {
            toDate = event.queryStringParameters.ToDateTime; 
        }
    }
    
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!event.queryStringParameters || !event.queryStringParameters.DevId) {
        done(new Error('No device ID'));
        return;
    }
    
    switch (event.httpMethod) {
        
        case 'GET':
            dynamo.query({ 
                TableName: 'AirMonitor', 
                ProjectionExpression: 'Created, Temperature',
                KeyConditionExpression: 'Created BETWEEN :FromDateTime AND :ToDateTime AND DevId = :DevId',
                ExpressionAttributeValues: {
                    ':DevId': event.queryStringParameters.DevId,
                    ':FromDateTime': fromDate,
                    ':ToDateTime': toDate
                }
            }, done);
            break;
            
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};

```
