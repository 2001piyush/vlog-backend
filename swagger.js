import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vlog API",
      version: "1.0.0",
      description: "API documentation for your Vlog site",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;