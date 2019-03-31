import React from "react";

import "./ChatScreen.css";

import { FormControl } from "react-bootstrap";
import { AvailableGroups } from "./AvailableGroups";

export const ChatScreen = ({ user, handleLogout }) => {
	return (
		<div className="app-layout">
			<div className="channels box">
				<div> List channels </div>
				<AvailableGroups />
			</div>
			<div className="header">
				{JSON.stringify(user)} <button onClick={handleLogout}>Logout</button>
			</div>
			<div className="messages box scroll-container">Chat entries here</div>
			<div className="input box">
				<FormControl type="text" placeholder="Type to talk..." autoFocus />
			</div>
		</div>
	);
};
