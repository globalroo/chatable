import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const allGroups = gql`
	{
		allGroups(orderBy: name_ASC) {
			id
			name
			description
		}
	}
`;

export const AvailableGroups = ({ group }) => {
	return (
		<Query query={allGroups}>
			{({ loading, error, data }) => {
				if (loading) return <p>Loading...</p>;
				if (error) return <p>Error :( {JSON.stringify(error)}</p>;
				return (
					<ul style={{ color: "white" }}>
						{data.allGroups.map((currentGroup, ix) => {
							const selectedGroup = currentGroup.id === group.id;
							const key = `groupSelector_${currentGroup.id}`;
							return (
								<li key={key} data-testid={key}>
									{currentGroup.name} <br />[{currentGroup.id}]<br />
									{selectedGroup ? "Current Group" : ""}
								</li>
							);
						})}
					</ul>
				);
			}}
		</Query>
	);
};
