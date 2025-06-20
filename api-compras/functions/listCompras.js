'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'prod_compras_curses';

const getTenantId = (event) => {
  return event.headers ? event.headers['tenant-id'] : 'default_tenant';
};

module.exports.listCompras = async (event) => {
  try {
    const tenantId = getTenantId(event);
    const { user_id } = event.queryStringParameters || {};

    if (!tenantId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing tenant_id' }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'tenant_id = :tenantId',
      ExpressionAttributeValues: {
        ':tenantId': tenantId,
      },
    };

    if (user_id) {
      params.FilterExpression = 'user_id = :user_id';
      params.ExpressionAttributeValues[':user_id'] = user_id;
    }

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Lista de compras obtenida',
        compras: result.Items,
      }),
    };
  } catch (error) {
    console.error('Error listing compras:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not list compras', error: error.message }),
    };
  }
};