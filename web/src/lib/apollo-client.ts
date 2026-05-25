import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

export const apolloClient = new ApolloClient({
    link: new BatchHttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/graphql",
        batchInterval: 20,
    }),
    cache: new InMemoryCache(),
});