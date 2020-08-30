import React, { useState, useEffect } from "react";
import "./mainlayout.scss";
import { Link } from "react-router-dom";
import { USER_ME } from "../../utils/urls";
import AppIcon from "../icons/Icon";
import { axiosHandler, getToken } from "../../utils/helper";
import { USERTOKEN } from "../../utils/data";
import { Button } from "../button/Button";

export const checkIfTokenIsValid = (_) => {
  return axiosHandler({
    method: "get",
    url: USER_ME,
    token: getToken(),
  });
};

function MainLayout(props) {
  const [isLoading, setLoading] = useState(true);
  const [sideBarStatus, setSideBarStatus] = useState(false);

  useEffect(() => {
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    let token = localStorage.getItem(USERTOKEN);
    if (!token) {
      props.history.push("/login");
      return;
    }
    let res = await checkIfTokenIsValid().catch((err) =>
      props.history.push("/login")
    );
    if (!res) return;
    setLoading(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mainLayout">
      <div className="desktop-side-bar side-bar">
        <SideBar sideBarStatus={sideBarStatus} />
      </div>
      <div id="sideBar" className="mobile-side-bar closed">
        <SideBar sideBarStatus={sideBarStatus} />
      </div>

      <div id="mainBar" className="mainBar">
        <div className="navBar">
          <div className="pageTitle">Impartnews Admin</div>
          <div className="navRight">
            <AppIcon
              type="feather"
              name={sideBarStatus ? "x" : "menu"}
              onClick={() => setSideBarStatus(!sideBarStatus)}
            />
          </div>
        </div>
        <div className="contentMain">
          <div className="children">{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;

const SideLinks = ({
  icon,
  title,
  link,
  active = false,
  logout,
  userControl,
  className,
}) => (
  <Link to={link} className={className}>
    <div
      className={`sideLink ${active ? "active" : ""} ${
        logout ? "logout" : ""
      } ${userControl ? "userControl" : ""}`}
    >
      <i className="icon-main">{icon}</i> {title}
    </div>
  </Link>
);

const getActive = (val) => {
  let ret = false;
  let pathArr = window.location.pathname.split("/");
  if (val === "/") {
    if (window.location.pathname === "/" || window.location.pathname === "") {
      return true;
    }
  }
  if (pathArr.includes(val)) {
    ret = true;
  }
  return ret;
};

const Profile = (props) => {
  return (
    <div className="user_profile">
      <div className="desc">
        <div className="avatar">IMP</div>
        <span>
          Impartnewspoint
          <div className="small">Admin</div>
        </span>
      </div>
    </div>
  );
};

const logout = () => {
  localStorage.removeItem(USERTOKEN);
  window.location.reload();
};

const SideBar = (props) => {
  return (
    <div className={`sideBar ${!props.sideBarStatus ? "close" : ""}`}>
      <Profile />
      <div className="sideItems">
        <SideLinks
          link={"/"}
          title="Blogs"
          active={getActive("/")}
          icon={<AppIcon name="rss" type="icomoon" />}
        />
        <SideLinks
          link={"/tags"}
          title="Tags"
          active={getActive("tags")}
          icon={<AppIcon name="bullhorn" type="icomoon" />}
        />
        <SideLinks
          link={"/marketting"}
          title="Marketting"
          active={getActive("marketting")}
          icon={<AppIcon name="cart" type="icomoon" />}
        />

        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};
