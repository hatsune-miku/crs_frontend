import React from "react";

import Button from "@mui/joy/Button";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";

import Typography from "@mui/joy/Typography";
import Alert from "@mui/material/Alert";
import {AlertColor} from "@mui/material/Alert";

import backgroundImage from "../static/mun.jpg";
import {Input} from "../joyui_ext/input";
import {MuiCompatCssVarsProvider} from "../joyui_ext/mui_compat";
import Network from "../util/network";
import {LoginResponse} from "../protocol/response_types";
import Session from "../util/session";
import {Navigate} from "react-router-dom";


type PageLoginProps = {};
type PageLoginState = {
    loginRole: string;
    username: string;
    password: string;
    alertText: string;
    shouldShowAlert: boolean;
    isLoading: boolean;
    loginText: string;
    alertSeverity: AlertColor;
    redirectTo: string | null;
};

export default class PageLogin extends React.Component<PageLoginProps,
    PageLoginState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loginRole: Session.getStoredRole() || "student",
            username: "",
            password: "",
            alertText: "",
            shouldShowAlert: false,
            isLoading: false,
            loginText: "Login",
            alertSeverity: "success",
            redirectTo: null
        };
    }

    componentDidMount() {
        this.tryRestoreSession();
    }

    handleRoleChange = (event: any) => {
        this.setState({loginRole: event.target.value});
    };

    handleUsernameChange = (event: any) => {
        this.setState({username: event.target.value});
    };

    handlePasswordChange = (event: any) => {
        this.setState({password: event.target.value});
    };

    handleForgotPassword = (event: any) => {
    };

    handleAlertClose = () => {
        this.setState({shouldShowAlert: false});
    };

    tryRestoreSession = async () => {
        const storedSessionId = Session.getStoredSessionId();
        const storedAccountNumber = Session.getStoredAccountNumber();
        if (!storedSessionId || !storedAccountNumber) {
            return;
        }
        this.setState({
            isLoading: true,
            shouldShowAlert: true,
            alertSeverity: "info",
            username: storedAccountNumber,
            alertText: "Session obtained. Restoring...",
        });
        console.log("sessionId", storedSessionId);

        try {
            if (await Session.isCurrentSessionValid()) {
                this.setState({
                    shouldShowAlert: true,
                    alertSeverity: "success",
                    alertText: "Redirecting...",
                    redirectTo: "/" + this.state.loginRole
                });
            } else {
                Session.clearStoredSessionId();
                Session.clearStoredAccountNumber();
                Session.clearStoredName();
                Session.clearStoredRole();

                this.setState({
                    shouldShowAlert: true,
                    alertSeverity: "error",
                    alertText: "Session expired.",
                });
            }
        } finally {
            this.setState({isLoading: false});
        }
    };

    handleLogin = async () => {
        if (!this.state.username || !this.state.password) {
            return;
        }

        this.setState({
            isLoading: true,
            shouldShowAlert: true,
            alertSeverity: "info",
            loginText: "Logging in...",
        });

        try {
            const response: LoginResponse = await Network.login({
                role: this.state.loginRole,
                sessionId: null,
                accountNumber: this.state.username,
                password: this.state.password
            });

            if (response.success) {
                Session.setStoredName(response.name);

                if (response.isAdmin) {
                    this.setState({
                        loginRole: "admin",
                    }, () => {
                        // Admin login.
                        Session.setStoredSessionId(response.sessionId);
                        Session.setStoredAccountNumber(this.state.username);
                        Session.setStoredRole('admin');
                        this.tryRestoreSession();
                    });
                }
                else {
                    // Others login.
                    Session.setStoredSessionId(response.sessionId);
                    Session.setStoredAccountNumber(this.state.username);
                    Session.setStoredRole(this.state.loginRole);
                    await this.tryRestoreSession();
                }

            } else {
                this.setState({
                    alertText: response.reason,
                    alertSeverity: "error",
                    shouldShowAlert: true,
                });
            }
        } catch (e) {
            this.setState({
                alertText: "Network error",
                alertSeverity: "error",
                shouldShowAlert: true,
            });
        } finally {
            this.setState({
                isLoading: false,
                loginText: "Login",
            });
        }
    };

    render(): React.ReactNode {
        if (this.state.redirectTo) {
            return <Navigate to={this.state.redirectTo}/>;
        }
        const loginBox = (
            <div
                className="dimmed"
                style={{
                    margin: "25px",
                    position: "relative",
                    textAlign: "center",
                }}
            >
                <Typography level="h4">Course Registration System</Typography>

                <div style={{margin: "25px"}}>
                    <Input
                        placeholder="User ID"
                        onChange={this.handleUsernameChange}
                        onKeyDown={(e) => {
                            e.key === "Enter" && this.handleLogin();
                        }}
                        disabled={this.state.isLoading}
                    ></Input>

                    <Input
                        placeholder="Password"
                        type="password"
                        style={{marginTop: "10px"}}
                        onChange={this.handlePasswordChange}
                        onKeyDown={(e) => {
                            e.key === "Enter" && this.handleLogin();
                        }}
                        disabled={this.state.isLoading}
                    ></Input>
                </div>

                <div style={{margin: "25px"}}>
                    <RadioGroup
                        row
                        name="loginRole"
                        variant="plain"
                        defaultValue="student"
                        value={this.state.loginRole}
                        onChange={this.handleRoleChange}
                        style={{
                            textAlign:
                                "left" /* Must be left! others make radio not responsible. */,
                            display: "inline",
                        }}
                    >
                        <Radio value="student" label="Student"/>
                        <Radio value="staff" label="Staff"/>
                    </RadioGroup>
                </div>

                <div style={{margin: "25px"}}>
                    <Button
                        fullWidth={true}
                        style={{maxWidth: "344px"}}
                        onClick={this.handleLogin}
                        disabled={this.state.isLoading}
                    >
                        {this.state.loginText}
                    </Button>

                    <br></br>

                    <Button
                        variant="plain"
                        style={{marginTop: "10px"}}
                        onClick={this.handleForgotPassword}
                    >
                        Forgot Password?
                    </Button>
                    {this.state.shouldShowAlert ? (
                        <MuiCompatCssVarsProvider>
                            <Alert
                                severity={this.state.alertSeverity}
                                onClose={this.handleAlertClose}
                            >
                                {this.state.alertText}
                            </Alert>
                        </MuiCompatCssVarsProvider>
                    ) : null}
                </div>
            </div>
        );

        return (
            <div
                className="full-screen"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundColor: "#454545",
                    backgroundBlendMode: "multiply",
                }}
            >
                <table className="fill-parent">
                    <tbody>
                    <tr>
                        <td width={"70%"}></td>
                        <td
                            className="dark-background"
                            style={{
                                opacity: 0.95,
                            }}
                        >
                            {loginBox}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="footer dimmed">
                    <h3>ENGI-9874 Course Project @ MUN</h3>
                </div>
            </div>
        );
    }
}
