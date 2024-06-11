import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import { useNavigate, Outlet } from 'react-router-dom';
import Header from './Header/Header'
import './Main.css'
import Sidenav from "./Sidenav/Sidenav";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
const { Header: AntHeader, Content, Sider } = Layout;

function Main({}) {

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#01989D");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  const [collapsed, setCollapsed] = useState(false)

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);
  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout
      className={`layout-dashboard `}
    >
      <div className="flex gap-1 justify-center align-center bg-[white] fixed">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          trigger={null}
          width={collapsed ? 0 : 225}
          theme="light"
          className={`sider-primary ant-layout-sider-primary `}
          style={{height:"100vh"}}
        >
          <Sidenav />
        </Sider>
        <div className="chat-history-toggle">
          {collapsed ? <DoubleRightOutlined onClick={toggleCollapsed} /> : <DoubleLeftOutlined onClick={toggleCollapsed} />}
        </div> 
      </div>
      <Layout>   
          <AntHeader className="header">
            <Header
              onPress={openDrawer}
              name={pathname}
              subName={pathname}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        <Content className={`content-ant bg-white pt-10 ${collapsed ? 'ml-4' : 'ml-60'}`}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Main;
