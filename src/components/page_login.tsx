import React, { ReactFragment } from "react";

import Button from "@mui/joy/Button";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";

import Typography from "@mui/joy/Typography";
import Alert from "@mui/material/Alert";

import backgroundImage from "../static/mun.jpg";
import { Input } from "../joyui_ext/input";
import { MuiCompatCssVarsProvider } from "../joyui_ext/mui_compat";
import Network from "../util/network";
import { SessionInfo } from '../protocol/response_types';

export default function PageLogin() {
  const [loginRole, setLoginRole] = React.useState("student");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alertText, setAlertText] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loginText, setLoginText] = React.useState("Login");

  const handleRoleChange = (event: any) => {
    setLoginRole(event.target.value);
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    setShowAlert(false);
    setLoading(true);
    setLoginText("Logging in...");

    try {
        const info: SessionInfo = await Network.studentLogin(
            Number.parseInt(username),
            password
        )
    
        if (info.success) {
            console.log(info.sessionId)
        }
        else {
            setAlertText("Invalid username or password.");
            setShowAlert(true);
        }
    }
    catch (e) {
        setAlertText("Network error.");
        setShowAlert(true);
    }
    finally {
        setLoading(false);
        setLoginText("Login");
    }
  };

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
          placeholder="Username"
          onChange={handleUsernameChange}
          onKeyDown={(e) => {
            e.key === "Enter" && handleLogin();
          }}
          disabled={loading}
        ></Input>

        <Input
          placeholder="Password"
          type="password"
          style={{ marginTop: "10px" }}
          onChange={handlePasswordChange}
          onKeyDown={(e) => {
            e.key === "Enter" && handleLogin();
          }}
          disabled={loading}
        ></Input>
      </div>

      <div style={{ margin: "25px" }}>
        <RadioGroup
          row
          name="loginRole"
          variant="plain"
          defaultValue="student"
          value={loginRole}
          onChange={handleRoleChange}
          style={{
            textAlign: "left" /* Must left! others make radio unresponsable. */,
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
          onClick={handleLogin}
          disabled={loading}
        >
          {loginText}
        </Button>
        <br></br>
        <Button
          variant="plain"
          style={{ marginTop: "10px" }}
          onClick={() => setShowAlert(true)}
        >
          Forgot Password?
        </Button>
        {(() => {
          if (showAlert) {
            return (
              <MuiCompatCssVarsProvider>
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                  {alertText}
                </Alert>
              </MuiCompatCssVarsProvider>
            );
          }
        })()}
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
