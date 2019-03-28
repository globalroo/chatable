import { ApolloClient } from "apollo-client";

import { getMainDefinition } from "apollo-utilities";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { setContext } from "apollo-link-context";

let basicTokenStore = null;
export const setBasicTokenStore = ({ token }) => (basicTokenStore = token);

// Add token to header
const authLink = setContext((_, { headers }) => {
	const token = basicTokenStore;
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ""
		}
	};
});

// Ensure subscriptions hit the websocket connection and CRUD hit Simple API
const endpoints = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === "OperationDefinition" && operation === "subscription";
	},
	new WebSocketLink({
		uri: `wss://subscriptions.graph.cool/v1/cjhdp4tzl2r890195ggdfyv2h`,
		options: {
			reconnect: true
		}
	}),
	new HttpLink({
		uri: "https://api.graph.cool/simple/v1/cjhdp4tzl2r890195ggdfyv2h"
	})
);

// Bind ApolloClient to our endpoint and Auth config.
export const apolloClient = new ApolloClient({
	link: authLink.concat(endpoints),
	cache: new InMemoryCache()
});
