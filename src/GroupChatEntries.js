import React, { useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const allGroupChatEntries = gql`
	query allGroupChatEntries($groupId: ID!) {
		allGroupChatEntries(filter: { group: { id: $groupId } }) {
			from {
				name
				id
			}
			id
			content
			edited
			deleted
			createdAt
		}
	}
`;

const ShowChat = ({ data }) => {
	const { allGroupChatEntries = [] } = data;

	return (
		<ul>
			{allGroupChatEntries.map(entry => (
				<li key={entry.id}>{JSON.stringify(entry)}</li>
			))}
		</ul>
	);
};

export const GroupMessages = ({ user, group }) => {
	console.log({ group });
	const [refresh, setRefresh] = useState(false);
	return (
		<Query
			query={allGroupChatEntries}
			fetchPolicy={"network-only"}
			variables={{ groupId: group.id, refresh }}
		>
			{({ data }) => (
				<>
					<ShowChat data={data} />
					<button onClick={() => setRefresh(!refresh)}>
						Manual refresh chat entries - click to see last chat {refresh}
					</button>
				</>
			)}
		</Query>
	);
};
