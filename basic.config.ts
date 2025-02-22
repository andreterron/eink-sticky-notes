// basic.config.ts lets you define the schema for your database
// after updating this file, you may need to restart the dev server
// docs: https://docs.basic.tech/info/schema

export const schema = {
  project_id: "",
  version: 0,
  tables: {
    emojis: {
      type: "collection",
      fields: {
        value: {
          type: "string",
        },
      },
    },
    tasks: {
      type: "collection",
      fields: {
        id: {
          type: "string",
          indexed: true,
        },
        name: {
          type: "string",
          indexed: true,
        },
        status: {
          type: "string",
          indexed: true,
        },
        createdAt: {
          type: "number",
          indexed: true,
        },
      },
    },
  },
};
