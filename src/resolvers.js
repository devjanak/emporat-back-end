const { PrismaClient } = require('./generated/prisma');
const { hashPassword, comparePassword, generateToken } = require('./utils/auth');
const { isAuthenticated, isAdmin } = require('./middleware/auth');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    me: (_, __, context) => {
      try {
        isAuthenticated(context);
        return prisma.user.findUnique({
          where: { id: context.user.id },
        });
      } catch (error) {
        return null;
      }
    },
    employees: async (_, { page = 1, pageSize = 10, sort }) => {
      // Calculate skip value for pagination
      const skip = (page - 1) * pageSize;
      
      // Set up orderBy object for sorting
      let orderBy = { id: 'asc' }; // Default sorting
      
      if (sort) {
        orderBy = {
          [sort.field]: sort.direction
        };
      }
      
      // Fetch employees with pagination and sorting
      const employees = await prisma.employee.findMany({
        skip,
        take: pageSize,
        orderBy,
      });
      
      // Get total count for pagination info
      const totalCount = await prisma.employee.count();
      
      return {
        employees,
        totalCount,
      };
    },
    employee: async (_, { id }) => {
      return prisma.employee.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    // Auth mutations
    signup: async (_, { email, password, role = 'USER' }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const hashedPassword = await hashPassword(password);
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });
      
      const token = generateToken(user);
      
      return {
        token,
        user,
      };
    },
    
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const validPassword = await comparePassword(password, user.password);
      
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }
      
      const token = generateToken(user);
      
      return {
        token,
        user,
      };
    },
    
    // Employee mutations
    createEmployee: async (_, args, context) => {
      isAdmin(context); // Only admin can create employees
      
      return prisma.employee.create({
        data: {
          name: args.name,
          age: args.age,
          class: args.class,
          subjects: args.subjects,
          attendance: args.attendance,
        },
      });
    },
    
    updateEmployee: async (_, { id, ...data }, context) => {
      isAdmin(context); // Only admin can update employees
      
      const updateData = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.age !== undefined) updateData.age = data.age;
      if (data.class !== undefined) updateData.class = data.class;
      if (data.subjects !== undefined) updateData.subjects = data.subjects;
      if (data.attendance !== undefined) updateData.attendance = data.attendance;
      
      return prisma.employee.update({
        where: { id },
        data: updateData,
      });
    },
    
    deleteEmployee: async (_, { id }, context) => {
      isAdmin(context); // Only admin can delete employees
      
      return prisma.employee.delete({
        where: { id },
      });
    },
  },
  
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },
  
  Employee: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },
};

module.exports = resolvers; 