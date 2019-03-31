import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import { apolloClient, setBasicTokenStore } from "./ApolloSetup";
import { LoginForm } from "./LoginForm";
import gql from "graphql-tag";

import { ChatScreen } from "./ChatScreen";
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

	const handleLogin = async ({ name, email, password }) => {
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
			const { token = "", ...usefulBit } = signinUser;
			const { user } = usefulBit;
			setBasicTokenStore(token);
			setUser(user);
		} catch (e) {
			setError(e.message);
		}
	};

	const handleLogout = () => {
		setUser(undefined);
		setBasicTokenStore({ token: null });
		apolloClient.resetStore();
	};
	const group = { name: "General", id: "cjtxbbp3yglac0183o1oovog7" }; // Hardcoded in server

	return (
		<ApolloProvider client={apolloClient}>
			<>
				{user ? (
					<ChatScreen user={user} group={group} handleLogout={handleLogout} />
				) : (
					<LoginForm handleLogin={handleLogin} />
				)}
				{error && <div>{error}</div>}
			</>
		</ApolloProvider>
	);
};

export default App;
