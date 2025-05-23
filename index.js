const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const { PrismaClient } = require('./src/generated/prisma');
const { authenticate } = require('./src/middleware/auth');

const prisma = new PrismaClient();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add authentication to context
      const authContext = authenticate(req);
      return {
        prisma,
        ...authContext
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🔋 Connected to database`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startApolloServer().catch(err => {
  console.error('Error starting server:', err);
}); 