import React, { useState } from "react";

import { FormGroup, Modal, FormControl, Button } from "react-bootstrap";

export const useInputHook = (initialValue = "") => {
	const [value, setValue] = useState(initialValue);
	const onChange = e => setValue(e.target.value);
	return {
		value,
		onChange
	};
};

export const LoginForm = ({ handleLogin }) => {
	const [loginMode, setLoginMode] = useState(true); // Login or Sign Up
	const email = useInputHook();
	const name = useInputHook();
	const password = useInputHook();
	return (
		<Modal.Dialog>
			<Modal.Body>
				<div className="login-logo-container">
					<h1>Chatable</h1>
					<h5>Create a user or use 'test/test' for signin</h5>
				</div>
				<div className="login-title-container">
					<span className="login-title-text">{loginMode ? "Login" : "Sign Up"}</span>
				</div>

				<FormGroup>
					{!loginMode && (
						<FormControl
							autoFocus={true}
							type="text"
							placeholder="Your name (to be used in chat)"
							{...name}
						/>
					)}
					<FormControl autoFocus={true} type="email" placeholder="Email" {...email} />
					<FormControl type="password" placeholder="Password" {...password} />
				</FormGroup>
				<FormGroup>
					<Button className="pointer" onClick={() => setLoginMode(!loginMode)}>
						{loginMode ? "Don't have an account? Sign up" : "Have an account? Log in"}
					</Button>
					<Button
						className="pull-right pointer"
						onClick={() =>
							handleLogin({
								name: name.value,
								email: email.value,
								password: password.value
							})
						}
					>
						{loginMode ? "Login" : "Create User"}
					</Button>
				</FormGroup>
			</Modal.Body>
		</Modal.Dialog>
	);
};
