'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'prod_cursos_curses';

const getTenantId = (event) => {
  return event.headers ? event.headers['tenant-id'] : 'default_tenant';
};

module.exports.deleteCurso = async (event) => {
  try {
    const tenantId = getTenantId(event);
    const { id } = event.pathParameters;

    if (!id || !tenantId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing curso_id or tenant_id' }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        tenant_id: tenantId,
        curso_id: id,
      },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Curso ${id} eliminado` }),
    };
  } catch (error) {
    console.error('Error deleting curso:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not delete curso', error: error.message }),
    };
  }
};