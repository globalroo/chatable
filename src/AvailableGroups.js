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

export const AvailableGroups = () => {
	return (
		<Query query={allGroups}>
			{({ loading, error, data }) => {
				if (loading) return <p>Loading...</p>;
				if (error) return <p>Error :( {JSON.stringify(error)}</p>;
				return (
					<ul style={{ color: "white" }}>
						{data.allGroups.map(group => (
							<li>
								{group.name} <br />[{group.id}]
							</li>
						))}
					</ul>
				);
			}}
		</Query>
	);
};
