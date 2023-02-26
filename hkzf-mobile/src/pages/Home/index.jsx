import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TabBar } from "antd-mobile";
import "./index.scss";

const Bottom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const setRouteActive = (value) => {
    navigate(value);
  };

  const tabs = [
    {
      key: "/home",
      title: "首页",
      icon: <i className="iconfont icon-ind"></i>,
    },
    {
      key: "/home/houseList",
      title: "找房",
      icon: <i className="iconfont icon-findHouse"></i>,
    },
    {
      key: "/home/news",
      title: "资讯",
      icon: <i className="iconfont icon-infom"></i>,
    },
    {
      key: "/home/profile",
      title: "我的",
      icon: <i className="iconfont icon-my"></i>,
    },
  ];

  return (
    <TabBar
      activeKey={pathname}
      onChange={(value) => setRouteActive(value)}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};
export default function Home() {
  return (
    <div className="home">
      <div className="center">
        {/* 指定路由组件呈现位置 */}
        <Outlet />
      </div>
      {/* Tabbar */}
      <div className="bottom">
        <Bottom />
      </div>
    </div>
  );
}
