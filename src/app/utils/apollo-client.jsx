import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.warn(
        `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network Error]:`, networkError);
  }
});

const authLink = new HttpLink({
  uri: "http://127.0.0.1:8000/auth_app/graphql/",
});

const productLink = new HttpLink({
  uri: "http://127.0.0.1:8000/product/graphql/",
});

export const authClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
  },
});

export const productClient = new ApolloClient({
  link: ApolloLink.from([errorLink, productLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first",
    },
  },
});
