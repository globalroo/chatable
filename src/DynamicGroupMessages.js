import React, { useEffect } from "react";

import gql from "graphql-tag";

const TRACK_CHAT_UPDATES_BY_GROUP = gql`
	subscription changedGroupChatEntry($groupId: ID!) {
		GroupChatEntry(
			filter: { mutation_in: [CREATED, UPDATED, DELETED], node: { group: { id: $groupId } } }
		) {
			mutation
			node {
				from {
					name
					id
				}
				id
				content
				edited
				deleted
				createdAt
				group {
					id
				}
			}
			updatedFields
			previousValues {
				content
				id
			}
		}
	}
`;

export const DynamicGroupMessages = ({ loading, error, subscribeToMore, group, apolloQuery }) => {
	useEffect(() => {
		// The subscription will trigger on any update to the table - try and simplify
		const unsubscribeFromGroup = subscribeToMore({
			document: TRACK_CHAT_UPDATES_BY_GROUP,
			variables: { groupId: group.id },
			updateQuery: (chatQueryResponse, { subscriptionData }) => {
				const { data } = subscriptionData;
				// Updates handled here - update server data and client will auto update.
				// Nothing new, nothing removed so just send the mutated data back.
				if (!data) return chatQueryResponse;

				// This 'GroupChatEntry' is derived from the gql tag above.
				// The subscription returns two things we're interested in.
				const { GroupChatEntry } = data;

				// The node is the recently created ChatEntry,
				const { mutation, node } = GroupChatEntry;

				// Only need to handle the 'CREATED'
				const { allGroupChatEntries = [] } = chatQueryResponse;

				switch (mutation) {
					case "CREATED":
						// Build new response with existing chat entries and the new ChatEntry
						return Object.assign({}, chatQueryResponse, {
							allGroupChatEntries: [...allGroupChatEntries, node]
						});
					default:
						return chatQueryResponse;
				}
			}
		});
		return () => {
			unsubscribeFromGroup();
		};
	}, []);

	const { data } = apolloQuery;
	const { allGroupChatEntries } = data;

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :( {JSON.stringify(error)}</p>;
	if (!allGroupChatEntries) return null;

	return (
		<ul>
			{allGroupChatEntries
				.filter(entry => entry.deleted !== true)
				.map(entry => (
					<li key={entry.id}>{JSON.stringify(entry)}</li>
				))}
		</ul>
	);
};
