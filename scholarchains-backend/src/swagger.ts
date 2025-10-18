import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ScholarChains Backend API',
      version: '1.0.0',
      description: 'OpenTimestamps cryptographic timestamping API for ScholarChains',
      contact: {
        name: 'ScholarChains',
        url: 'https://github.com/scholarchains',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.scholarchains.example.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Timestamps',
        description: 'OpenTimestamps operations',
      },
      {
        name: 'Health',
        description: 'Service health checks',
      },
    ],
    components: {
      schemas: {
        TimestampInfo: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'number',
              description: 'Unix timestamp in seconds',
              example: 1708774162,
            },
            blockHeight: {
              type: 'number',
              description: 'Bitcoin block height',
              example: 850000,
            },
            blockHash: {
              type: 'string',
              description: 'Bitcoin block hash',
              example: '00000000000000000001234567890abcdef...',
            },
            isPending: {
              type: 'boolean',
              description: 'Whether the timestamp is pending Bitcoin confirmation',
              example: true,
            },
          },
        },
        CreateTimestampRequest: {
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              type: 'string',
              description: 'The data to timestamp',
              example: 'ScholarChains paper metadata',
            },
            calendars: {
              type: 'array',
              description: 'Optional custom calendar servers',
              items: {
                type: 'string',
                format: 'uri',
              },
              example: [
                'https://alice.btc.calendar.opentimestamps.org',
                'https://bob.btc.calendar.opentimestamps.org',
              ],
            },
          },
        },
        CreateTimestampResponse: {
          type: 'object',
          properties: {
            proof: {
              type: 'string',
              description: 'Base64-encoded OpenTimestamps proof',
              example: 'AE9wZW5UaW1lc3RhbXBz...',
            },
            info: {
              $ref: '#/components/schemas/TimestampInfo',
            },
          },
        },
        VerifyTimestampRequest: {
          type: 'object',
          required: ['proof', 'data'],
          properties: {
            proof: {
              type: 'string',
              description: 'Base64-encoded OpenTimestamps proof',
              example: 'AE9wZW5UaW1lc3RhbXBz...',
            },
            data: {
              type: 'string',
              description: 'The original data that was timestamped',
              example: 'ScholarChains paper metadata',
            },
          },
        },
        UpgradeTimestampRequest: {
          type: 'object',
          required: ['proof'],
          properties: {
            proof: {
              type: 'string',
              description: 'Base64-encoded OpenTimestamps proof to upgrade',
              example: 'AE9wZW5UaW1lc3RhbXBz...',
            },
          },
        },
        UpgradeTimestampResponse: {
          type: 'object',
          properties: {
            proof: {
              type: 'string',
              description: 'Base64-encoded upgraded proof',
              example: 'AE9wZW5UaW1lc3RhbXBz...',
            },
            upgraded: {
              type: 'boolean',
              description: 'Whether the proof was upgraded',
              example: true,
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-18T12:00:00.000Z',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Failed to create timestamp',
            },
            message: {
              type: 'string',
              example: 'Detailed error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
