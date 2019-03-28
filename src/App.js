import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { apolloClient, setBasicTokenStore } from "./ApolloSetup";
import gql from "graphql-tag";

import "./App.css";

/* CREATE USER MUTATION
mutation {
  createUser(name: "testUser", authProvider: {email: {email: "null", password: "null"}}) {
    id
  }
}
*/

const login = gql`
	mutation login($email: String!, $password: String!) {
		signinUser(email: { email: $email, password: $password }) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

const attemptLogin = async ({ email, password }) => {
	// Perform signin mutation
	const response = await apolloClient.mutate({
		mutation: login,
		variables: {
			email,
			password
		}
	});
	return response;
};

const App = () => {
	const [response, setResponse] = useState();
	useEffect(() => {
		attemptLogin({ email: "null", password: "null" }).then(response => {
			setResponse(response);
			setBasicTokenStore(response);
		});
	}, []);
	return (
		<ApolloProvider client={apolloClient}>
			<>{response && <div>{JSON.stringify(response)}</div>}</>
		</ApolloProvider>
	);
};

export default App;
