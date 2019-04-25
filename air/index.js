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
