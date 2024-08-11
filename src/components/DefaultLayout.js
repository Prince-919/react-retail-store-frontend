import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  CopyOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import "../resources/layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";

const { Header, Sider, Content } = Layout;

export default function DefaultLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, []);

  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <HashLoader color="#4e54c8" />
        </div>
      )}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <h3>Shopify POS</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
          items={[
            {
              key: "/home",
              icon: <HomeOutlined />,
              label: <Link to="/home">Home</Link>,
            },
            {
              key: "/cart",
              icon: <ShoppingCartOutlined />,
              label: <Link to="/cart">Cart</Link>,
            },
            {
              key: "/bills",
              icon: <CopyOutlined />,
              label: <Link to="/bills">Bills</Link>,
            },
            {
              key: "/items",
              icon: <UnorderedListOutlined />,
              label: <Link to="/items">Items</Link>,
            },
            {
              key: "/customers",
              icon: <UserOutlined />,
              label: <Link to="/customers">Customers</Link>,
            },
            {
              key: "/logout",
              icon: <LogoutOutlined />,
              label: (
                <div
                  onClick={() => {
                    localStorage.removeItem("pos-user");
                    navigate("/login");
                  }}
                >
                  Logout
                </div>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "15px", background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div
            className="cart-count d-flex align-items-center "
            onClick={() => navigate("/cart")}
          >
            <p className="mt-3 mr-2">{cartItems.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          style={{
            margin: "10px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
