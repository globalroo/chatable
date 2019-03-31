import React from "react";
import { Mutation } from "react-apollo";
import { FormGroup, InputGroup, Button, FormControl } from "react-bootstrap";
import gql from "graphql-tag";

const createGroupChatEntryMutation = gql`
	mutation createGroupChatEntry($fromId: ID!, $content: String!, $groupId: ID!) {
		createGroupChatEntry(fromId: $fromId, content: $content, groupId: $groupId) {
			content
			from {
				name
				id
			}
			group {
				id
			}
			id
			createdAt
		}
	}
`;

const AddChatComponent = ({ user, group, createGroupChatEntry }) => {
	let inputRef;
	return (
		<div>
			<form
				onSubmit={e => {
					// Use form handle enter key quickly
					e.preventDefault();
					if (inputRef.value.length > 0) {
						createGroupChatEntry({
							variables: {
								fromId: user.id,
								content: inputRef.value,
								groupId: group.id
							}
						});
						inputRef.value = "";
					}
				}}
			>
				<FormGroup>
					<InputGroup>
						<FormControl
							type="text"
							placeholder="Type to talk..."
							autoFocus
							inputRef={node => {
								inputRef = node;
							}}
						/>
						<InputGroup.Button>
							<Button className="btn btn-primary" type="submit">
								Send
							</Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>
			</form>
		</div>
	);
};

export const AddChat = ({ user, group }) => (
	<Mutation mutation={createGroupChatEntryMutation}>
		{createGroupChatEntry => (
			<AddChatComponent
				createGroupChatEntry={createGroupChatEntry}
				user={user}
				group={group}
			/>
		)}
	</Mutation>
);
