const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const { PrismaClient } = require('./src/generated/prisma');
const { authenticate } = require('./src/middleware/auth');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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