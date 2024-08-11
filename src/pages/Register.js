import { Button, Col, Form, Input, message, Row } from "antd";
import "../resources/authentication.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { HIDE_LOADING, SHOW_LOADING } from "../redux/cartItems";
import { useEffect } from "react";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onFinish(values) {
    dispatch({ type: SHOW_LOADING });
    axios
      .post(
        "https://retail-store-api-mzdn.onrender.com/api/auth/register",
        values
      )
      .then((res) => {
        dispatch({ type: HIDE_LOADING });
        message.success("Registered successfully");
      })
      .catch((err) => {
        dispatch({ type: HIDE_LOADING });
        message.error("Something went wrong!");
      });
  }
  useEffect(() => {
    if (localStorage.getItem("pos-user")) navigate("/home");
  }, []);

  return (
    <div className="authentication">
      <Row>
        <Col lg={6} xs={22}>
          <Form layout="vertical" onFinish={onFinish}>
            <h2
              className="fw-bold"
              style={{
                color: "#212529",
              }}
            >
              Shopify POS
            </h2>
            <hr className="mb-4" />

            <Form.Item name={"name"} label="Name">
              <Input className="py-2" placeholder="Name" />
            </Form.Item>
            <Form.Item name={"email"} label="Email">
              <Input className="py-2" type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item name={"password"} label="Password">
              <Input className="py-2" type="password" placeholder="Password" />
            </Form.Item>

            <div className="d-flex align-items-center justify-content-between">
              <div className="text-white mt-3">
                Already have an account?{" "}
                <Link to={"/login"} className="text-white fw-semibold">
                  Login
                </Link>
              </div>
              <Button className="mt-3 auth-btn w-25 " htmlType="submit">
                Sign Up
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
