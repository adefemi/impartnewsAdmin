import React, { useState, useEffect } from "react";
import FormGroup from "../../components/formGroup/formGroup";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import "./login.scss";
import logo from "../../assets/logo.png";
import { USERTOKEN } from "../../utils/data";
import {
  errorHandler,
  genericChangeSingle,
  axiosHandler,
} from "../../utils/helper";
import { LOGIN_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";

function Login(props) {
  const [loginData, setLoginData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem(USERTOKEN);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: loginData,
    }).then(
      (res) => {
        console.log(res);
        localStorage.setItem(USERTOKEN, res.data.access);
        props.history.push("/");
      },
      (err) => {
        Notification.bubble({
          type: "error",
          content: errorHandler(err),
        });
        setLoading(false);
      }
    );
  };

  return (
    <div className="auth-container">
      <div className="logo">
        <img src={logo} />
      </div>
      <form onSubmit={onSubmit} className="login-form">
        <h3>Sign In</h3>
        <FormGroup label="Username">
          <Input
            placeholder={"Enter your username"}
            value={loginData.username || ""}
            required
            name="username"
            onChange={(e) => genericChangeSingle(e, setLoginData, loginData)}
          />
        </FormGroup>
        <FormGroup label="Password">
          <Input
            placeholder={"Enter your password"}
            value={loginData.password || ""}
            required
            name="password"
            type="password"
            onChange={(e) => genericChangeSingle(e, setLoginData, loginData)}
          />
        </FormGroup>
        <br />
        <Button type="submit" loading={loading} disabled={loading}>
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
