/*** SCHEMA ***/
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, makeVar, Observable, useReactiveVar } from "@apollo/client";
import { graphql, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, print } from 'graphql';
/*** APP ***/
import React from "react";
import { render } from "react-dom";
import "./index.css";
import { useMyTasks, useMyTasks2 } from './useMyTasks';
const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name,
        };

        peopleData.push(person);
        return person;
      }
    },
  },
});

const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });

function delay(wait) {
  return new Promise(resolve => setTimeout(resolve, wait));
}

const link = new ApolloLink(operation => {
  return new Observable(async observer => {
    const { query, operationName, variables } = operation;
    await delay(300);
    try {
      const result = await graphql(
        schema,
        print(query),
        null,
        null,
        variables,
        operationName,
      );
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});

export const myTodos = makeVar({ 1: { id: 1, title: 'bins' } })
export const myTodos2 = makeVar({ 1: { id: 1, title: 'bins2' } })

function App() {
  const { handle } = useMyTasks()
  const { handle2 } = useMyTasks2()

  const x = useReactiveVar(myTodos)
  const x2 = useReactiveVar(myTodos2)

  console.log('x', x)
  console.log('x2', x2)

  return (
    <main>
      <button onClick={() => handle({ id: 2, title: 'shopping' })}>Add To do (doesn't work)</button>
      {Object.values(x).map(item => <div key={item.id}>{item.title}</div>)}

      <button onClick={() => handle2({ id: 2, title: 'shopping' })}>Add To do 2(does work)</button>
      {Object.values(x2).map(item => <div key={item.id}>{item.title}</div>)}
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
