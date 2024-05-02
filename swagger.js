const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ronda API",
      version: "1.0.0",
      description: "Rest API Ronda-C16",
    },
    components: {
      schemas: {
        Resource: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            userId: {
              type: "string",
            },
            description: {
              type: "string",
            },
            comuna: {
              type: "string",
            },
            url: {
              type: "string",
            },
            highlighted: {
              type: "boolean",
              default: false,
            },
            image: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["userId", "description", "comuna", "image"], // Updated required fields
        },
        ResourceInput: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
            description: {
              type: "string",
            },
            comuna: {
              type: "string",
            },
            url: {
              type: "string",
            },
            highlighted: {
              type: "boolean",
              default: false,
            },
            image: {
              type: "string",
            },
          },
          required: ["userId", "description", "comuna", "image"], 
        },
        ResourcesResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Resource",
              },
            },
            currentPage: {
              type: "integer",
            },
            totalPages: {
              type: "integer",
            },
            totalItems: {
              type: "integer",
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            userId: {
              type: "string",
            },
            content: {
              type: "string",
              maxLength: 2000,
            },
            image: {
              type: "string",
            },
            parentId: {
              type: "integer",
              description: "ID of the parent post if this is a reply",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["userId", "content"],
        },
        PostInput: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
            content: {
              type: "string",
              maxLength: 2000,
            },
            image: {
              type: "string",
            },
            parentId: {
              type: "integer",
              description: "ID of the parent post if this is a reply",
              nullable: true,
            },
          },
          required: ["userId", "content"],
        },
        PostsResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
            },
            currentPage: {
              type: "integer",
            },
            totalPages: {
              type: "integer",
            },
            totalItems: {
              type: "integer",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            firstname: {
              type: "string",
            },
            lastname: {
              type: "string",
            },
            email: {
              type: "string",
            },
            phone: {
              type: "string",
            },
            rut: {
              type: "string",
            },
            birthday: {
              type: "string",
              format: "date",
            },
            gender: {
              type: "string",
            },
            region: {
              type: "string",
            },
            comuna: {
              type: "string",
            },
            photo: {
              type: "string",
            },
            completed: {
              type: "boolean",
            },
            roleId: {
              type: "integer",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "email"],
        },
        NewUserInput: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            email: {
              type: "string",
            },
          },
          required: ["id", "email"],
        },
        UserUpdateInput: {
          type: "object",
          properties: {
            firstname: {
              type: "string",
            },
            lastname: {
              type: "string",
            },
            email: {
              type: "string",
            },
            phone: {
              type: "string",
            },
            rut: {
              type: "string",
            },
            birthday: {
              type: "string",
              format: "date",
            },
            gender: {
              type: "string",
            },
            region: {
              type: "string",
            },
            comuna: {
              type: "string",
            },
            photo: {
              type: "string",
            },
            completed: {
              type: "boolean",
            },
          },
        },
        UsersResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
            currentPage: {
              type: "integer",
            },
            totalPages: {
              type: "integer",
            },
            totalItems: {
              type: "integer",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        Material: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            userId: {
              type: "string",
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            materialURL: {
              type: "string",
            },
            duration: {
              type: "integer",
            },
          },
          required: [
            "userId",
            "title",
            "description",
            "materialURL",
            "duration",
          ],
        },
        MaterialInput: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            materialURL: {
              type: "string",
            },
            duration: {
              type: "integer",
            },
          },
          required: [
            "userId",
            "title",
            "description",
            "materialURL",
            "duration",
          ],
        },
        MaterialsResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Material",
              },
            },
            currentPage: {
              type: "integer",
            },
            totalPages: {
              type: "integer",
            },
            totalItems: {
              type: "integer",
            },
          },
        },
        Role: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
          },
          required: ["id", "name"],
        },
        RoleInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
          },
          required: ["name"],
        },
        RolesResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Role",
              },
            },
          },
        },
         ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        MailInput: {
          type: "object",
          properties: {
            email: {
              type: "string",
            },
          },
          required: ["email"],
        },
        MailResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        Partner: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            userId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
              maxLength: 2000,
            },
            image: {
              type: "string",
            },
            url: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["userId", "name", "description", "image", "url"],
        },
        partnerInput: {
          type: "object",
          properties: {
            userId: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
              maxLength: 2000,
            },
            image: {
              type: "string",
            },
            url: {
              type: "string",
            },
          },
          required: ["userId", "name", "description", "image", "url"],
        },
        partnerResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Partner",
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        Report: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            userId: {
              type: "string",
            },
            author: {
              type: "string",
            },
            content: {
              type: "string",
            },
            quantity: {
              type: "integer",
            },
            active: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date",
            },
            updatedAt: {
              type: "string",
              format: "date",
            }
          },
        },
        ReportInput: {
          type: "object",
          properties: {
            postId: {
              type: "string",
            },
          },
        },
       ReportUpdateInput: {
         type: "object",
         properties: {
           active: {
             type: "boolean",
           }
         },
       }
      }, //  ---
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
