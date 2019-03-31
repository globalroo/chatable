import React from "react";

import "./ChatScreen.css";

import { AvailableGroups } from "./AvailableGroups";
import { AddChat } from "./AddChat";
import { GroupMessages } from "./GroupChatEntries";

export const ChatScreen = ({ user, group, handleLogout }) => {
	console.log(user);
	return (
		<div className="app-layout">
			<div className="channels box">
				<div> List channels </div>
				<AvailableGroups group={group} />
			</div>
			<div className="header">
				{JSON.stringify(user)} <button onClick={handleLogout}>Logout</button>
			</div>
			<div className="messages box scroll-container">
				<GroupMessages group={group} />
			</div>
			<div className="input box">
				<AddChat user={user} group={group} />
			</div>
		</div>
	);
};
