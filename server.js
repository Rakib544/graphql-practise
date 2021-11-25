const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

const app = express();

// creating fake data

const Owners = [
  { id: 1, name: "John Astle" },
  { id: 2, name: "Gautam Sharma" },
  { id: 3, name: "Kane Williamson" },
];

const Websites = [
  { id: 1, name: "Facebook", ownerId: 1 },
  { id: 2, name: "Google", ownerId: 2 },
  { id: 3, name: "Amazon", ownerId: 3 },
  { id: 4, name: "Github", ownerId: 1 },
  { id: 5, name: "Medium", ownerId: 2 },
  { id: 6, name: "Baidu", ownerId: 3 },
  { id: 7, name: "Zapak", ownerId: 1 },
  { id: 8, name: "Cricinfo", ownerId: 2 },
];

const websiteType = new GraphQLObjectType({
  name: "Website",
  description: "This represents a website made by a Owner(Programmer)",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const ownerType = new GraphQLObjectType({
  name: "Owner",
  description: "This represents a Owner",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    websites: {
      type: new GraphQLList(websiteType),
      description: "List of all websites",
      resolve: () => Websites,
    },
    owners: {
      type: new GraphQLList(ownerType),
      description: "List of all owners",
      resolve: () => Owners,
    },
    website: {
      type: websiteType,
      description: "A single website",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        Websites.find((website) => website.id === args.id),
    },
    owner: {
      type: ownerType,
      description: "A single owner",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        Websites.find((website) => owner.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addWebsite: {
      type: websiteType,
      description: "Add a website",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        ownerId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = {
          id: Websites.length + 1,
          name: args.name,
          ownerId: args.ownerId,
        };
        Websites.push(website);
        return website;
      },
    },
    removeWebsite: {
      type: websiteType,
      description: "Remove a Website",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        Websites = Websites.filter((website) => website.id !== args.id);
        return Websites[args.id];
      },
    },
    addOwner: {
      type: ownerType,
      description: "Add an Owner",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const owner = { id: Owners.length + 1, name: args.name };
        Owners.push(owner);
        return owner;
      },
    },
    removeOwner: {
      type: ownerType,
      description: "Remove an Owner",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        Owners = Owners.filter((owner) => owner.id !== args.id);
        return Owners[args.id];
      },
    },
    updateOwner: {
      type: ownerType,
      description: "Update an Owner",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        Owners[args.id - 1].name = args.name;
        return Owners[args.id - 1];
      },
    },
    updateWebsite: {
      type: websiteType,
      description: "Update a Website",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        ownerId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        Websites[args.id - 1].name = args.name;
        Websites[args.id - 1].ownerId = args.ownerId;
        return Websites[args.id - 1];
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
