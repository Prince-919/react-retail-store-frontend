import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { REMOVE_FROM_CART, UPDATE_CART } from "../redux/cartItems";
import { useEffect, useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const dispatch = useDispatch();
  const [subTotal, setSubTotal] = useState(0);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const navigate = useNavigate();

  function increaseQty(record) {
    dispatch({
      type: UPDATE_CART,
      payload: { ...record, quantity: record.quantity + 1 },
    });
  }
  function decreaseQty(record) {
    if (record.quantity !== 1) {
      dispatch({
        type: UPDATE_CART,
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="image" width={60} height={60} />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQty(record)}
            style={{
              color: "#0077b6",
            }}
          />
          <b
            style={{
              color: "#495057",
            }}
          >
            {record.quantity}
          </b>
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQty(record)}
            style={{
              color: "#0077b6",
            }}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: REMOVE_FROM_CART, payload: record })}
          style={{
            color: "#d62828",
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp += item.price * item.quantity;
    });
    setSubTotal(temp);
  }, [cartItems]);

  function onFinish(values) {
    const reqObj = {
      ...values,
      subTotal,
      cartItems,
      tax: Number(((subTotal / 100) * 10).toFixed(2)),
      totalAmount: Number(
        subTotal + Number(((subTotal / 100) * 10).toFixed(2))
      ),
      userId: JSON.parse(localStorage.getItem("pos-user"))._id,
    };
    axios
      .post(
        "https://retail-store-api-mzdn.onrender.com/api/bills/charge",
        reqObj
      )
      .then((res) => {
        message.success("Bill charged successfully");
        navigate("/bills");
      })
      .catch((error) => {
        message.error("Something went wrong!");
      });
  }

  return (
    <DefaultLayout>
      <h3>Cart</h3>

      {loading ? (
        <div className="spinner">
          <HashLoader color="#4e54c8" />
        </div>
      ) : (
        <Table columns={columns} dataSource={cartItems} bordered />
      )}

      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end ">
        <div className="sub-total">
          <h3>
            Sub Total : <strong>{subTotal}</strong> $/-
          </h3>
        </div>
        <Button className="btn" onClick={() => setBillChargeModal(true)}>
          Charge Bill
        </Button>
      </div>
      <Modal
        title="Charge Bill"
        visible={billChargeModal}
        footer={false}
        onCancel={() => setBillChargeModal(false)}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name={"customerName"} label="Customer Name">
            <Input placeholder="Customer Name" style={{ color: "black" }} />
          </Form.Item>
          <Form.Item name={"phoneNumber"} label="Phone Number">
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item name={"paymentMode"} label="Payment Mode">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>

          <div className="charge-bill">
            <h5>
              Sub Total : <strong>{subTotal}</strong>
            </h5>
            <h5>
              Tax :{" "}
              <strong>{Number(((subTotal / 100) * 10).toFixed(2))}</strong>
            </h5>
            <hr />
            <h2>
              Grand Total :
              <strong>
                {subTotal + Number(((subTotal / 100) * 10).toFixed(2))}
              </strong>
            </h2>
          </div>
          <div className="d-flex justify-content-end">
            <Button className="btn" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
}
