const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum Role {
    ADMIN
    USER
  }

  type User {
    id: Int!
    email: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: Int!
    name: String!
    age: Int!
    class: String!
    subjects: String!
    attendance: Float!
    createdAt: String!
    updatedAt: String!
  }

  type EmployeesResponse {
    employees: [Employee!]!
    totalCount: Int!
  }

  enum SortDirection {
    asc
    desc
  }

  enum EmployeeSortField {
    id
    name
    age
    class
    subjects
    attendance
    createdAt
    updatedAt
  }

  input EmployeeSortInput {
    field: EmployeeSortField!
    direction: SortDirection!
  }

  type Query {
    me: User
    employees(
      page: Int
      pageSize: Int
      sort: EmployeeSortInput
    ): EmployeesResponse!
    employee(id: Int!): Employee
  }

  type Mutation {
    # Auth mutations
    signup(email: String!, password: String!, role: Role): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # Employee mutations
    createEmployee(
      name: String!
      age: Int!
      class: String!
      subjects: String!
      attendance: Float!
    ): Employee!
    
    updateEmployee(
      id: Int!
      name: String
      age: Int
      class: String
      subjects: String
      attendance: Float
    ): Employee!
    
    deleteEmployee(id: Int!): Employee
  }
`;

module.exports = typeDefs; 