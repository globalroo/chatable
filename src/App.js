import React, { useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import { apolloClient, setBasicTokenStore } from "./ApolloSetup";
import { LoginForm } from "./LoginForm";
import gql from "graphql-tag";

import "./App.css";

const createUserAndSignOn = gql`
	mutation createUserAndSignOn($name: String!, $email: String!, $password: String!) {
		createUser(name: $name, authProvider: { email: { email: $email, password: $password } }) {
			id
		}
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

const signOn = gql`
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

const App = () => {
	const [user, setUser] = useState();
	const [error, setError] = useState();

	const attemptLogin = async ({ name, email, password }) => {
		setError(null);
		setUser(null);
		try {
			const result = await apolloClient.mutate({
				mutation: name === "" ? signOn : createUserAndSignOn,
				variables: {
					name: name,
					email: email,
					password: password
				}
			});
			const { data = {} } = result;
			const { signinUser = {} } = data;
			const { token = "" } = signinUser;
			setBasicTokenStore(token);
			setUser(signinUser);
		} catch (e) {
			setError(e.message);
		}
	};
	return (
		<ApolloProvider client={apolloClient}>
			<>
				<LoginForm handleLogin={attemptLogin} />
				{user && <div>{JSON.stringify(user)}</div>}
				{error && <div>{error}</div>}
			</>
		</ApolloProvider>
	);
};

export default App;
