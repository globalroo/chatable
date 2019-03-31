import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { DynamicGroupMessages } from "./DynamicGroupMessages";

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

export const GroupMessages = ({ user, group }) => {
	console.log({ group });

	return (
		<Query
			query={allGroupChatEntries}
			fetchPolicy={"network-only"}
			variables={{ groupId: group.id }}
		>
			{({ subscribeToMore, ...apolloQuery }) => (
				<DynamicGroupMessages
					apolloQuery={apolloQuery}
					group={group}
					subscribeToMore={subscribeToMore}
					user={user}
				/>
			)}
		</Query>
	);
};
