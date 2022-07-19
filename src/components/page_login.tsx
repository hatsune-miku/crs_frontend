import React, { ReactFragment, useState } from "react";

import Button from "@mui/joy/Button";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";

import Typography from "@mui/joy/Typography";
import Alert from "@mui/material/Alert";
import { AlertColor } from "@mui/material/Alert";

import backgroundImage from "../static/mun.jpg";
import { Input } from "../joyui_ext/input";
import { MuiCompatCssVarsProvider } from "../joyui_ext/mui_compat";
import Network from "../util/network";
import { LoginResponse } from "../protocol/response_types";
import Session from "../util/session";

import { useHistory } from "react-router-dom";


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
};

export default class PageLogin extends React.Component<
  PageLoginProps,
  PageLoginState
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loginRole: "student",
      username: "",
      password: "",
      alertText: "",
      shouldShowAlert: false,
      isLoading: false,
      loginText: "Login",
      alertSeverity: "success",
    };

    setTimeout(() => {
        console.log("PageLogin mounted");
        this.tryRestoreSession();
    }, 200);
  }

  handleRoleChange = (event: any) => {
    this.setState({ loginRole: event.target.value });
  };

  handleUsernameChange = (event: any) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: any) => {
    this.setState({ password: event.target.value });
  };

  handleForgotPassword = (event: any) => {};

  handleAlertClose = () => {
    this.setState({ shouldShowAlert: false });
  };

  tryRestoreSession = async () => {
    const storedSessionId = Session.getStoredSessionId();
    const storedUserId = Session.getStoredUserId();
    if (!storedSessionId || !storedUserId) {
        return;
    }
    this.setState({
        isLoading: true,
        shouldShowAlert: true,
        alertSeverity: "info",
        username: storedUserId,
        alertText: "Session obtained. Restoring...",
      });
      console.log("sessionId", storedSessionId);

      try {
        const response: LoginResponse = await Network.login({
            role: this.state.loginRole,
            sessionId: storedSessionId,
            userId: storedUserId,
            password: null
          });
    
          if (response.success) {
            this.setState({
                shouldShowAlert: true,
                alertSeverity: "success",
                alertText: "Redirecting...",
            });
            useHistory().push("/" + this.state.loginRole);
          }
          else {
            Session.clearStoredSessionId();
            Session.clearStoredUserId();
            this.setState({
                shouldShowAlert: true,
                alertSeverity: "error",
                alertText: response.reason,
            });
          }
      }
      finally {
        this.setState({ isLoading: false });
      }
  };

  handleLogin = async () => {
    if (!this.state.username || !this.state.password) {
      return;
    }

    this.setState({
      isLoading: true,
      shouldShowAlert: true,
      loginText: "Logging in...",
    });

    try {
      const response: LoginResponse = await Network.login({
        role: this.state.loginRole,
        sessionId: null,
        userId: this.state.username,
        password: this.state.password
      });

      if (response.success) {
        Session.setStoredSessionId(response.sessionId);
        Session.setStoredUserId(this.state.username);
        this.tryRestoreSession();
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

        <div style={{ margin: "25px" }}>
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
            style={{ marginTop: "10px" }}
            onChange={this.handlePasswordChange}
            onKeyDown={(e) => {
              e.key === "Enter" && this.handleLogin();
            }}
            disabled={this.state.isLoading}
          ></Input>
        </div>

        <div style={{ margin: "25px" }}>
          <RadioGroup
            row
            name="loginRole"
            variant="plain"
            defaultValue="student"
            value={this.state.loginRole}
            onChange={this.handleRoleChange}
            style={{
              textAlign:
                "left" /* Must left! others make radio unresponsable. */,
              display: "inline",
            }}
          >
            <Radio value="student" label="Student" />
            <Radio value="staff" label="Staff" />
          </RadioGroup>
        </div>

        <div style={{ margin: "25px" }}>
          <Button
            fullWidth={true}
            style={{ maxWidth: "344px" }}
            onClick={this.handleLogin}
            disabled={this.state.isLoading}
          >
            {this.state.loginText}
          </Button>

          <br></br>

          <Button
            variant="plain"
            style={{ marginTop: "10px" }}
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
