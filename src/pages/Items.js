import DefaultLayout from "../components/DefaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../src/resources/items.css";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_LOADING, SHOW_LOADING } from "../redux/cartItems";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import { HashLoader } from "react-spinners";

export default function Items() {
  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.rootReducer);

  function getAllItems() {
    dispatch({ type: SHOW_LOADING });
    axios
      .get("https://retail-store-api-mzdn.onrender.com/api/items/get-all")
      .then((response) => {
        dispatch({ type: HIDE_LOADING });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: HIDE_LOADING });
        console.log(error);
      });
  }

  function deleteItem(record) {
    dispatch({ type: "showLoading" });
    axios
      .post("https://retail-store-api-mzdn.onrender.com/api/items/delete", {
        itemId: record._id,
      })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success("Item deleted successdully");
        getAllItems();
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error("Something went wrong");
        console.log(error);
      });
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
      title: "Category",
      dataIndex: "category",
    },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            style={{
              color: "#0077b6",
            }}
            onClick={() => {
              setEditingItem(record);
              setAddEditModalVisible(true);
            }}
          />

          <DeleteOutlined
            className="mx-2"
            style={{
              color: "#d62828",
            }}
            onClick={() => deleteItem(record)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllItems();
  }, []);

  function onFinish(values) {
    dispatch({ type: SHOW_LOADING });
    if (editingItem === null) {
      axios
        .post(
          "https://retail-store-api-mzdn.onrender.com/api/items/add",
          values
        )
        .then((response) => {
          dispatch({ type: HIDE_LOADING });
          message.success("Item added successfully");
          setAddEditModalVisible(false);
          getAllItems();
        })
        .catch((error) => {
          dispatch({ type: HIDE_LOADING });
          message.success("Something went wrong!");
          console.log(error);
        });
    } else {
      axios
        .put("https://retail-store-api-mzdn.onrender.com/api/items/update", {
          ...values,
          itemId: editingItem._id,
        })
        .then((response) => {
          dispatch({ type: HIDE_LOADING });
          message.success("Item updated successfully");
          setEditingItem(null);
          setAddEditModalVisible(false);
          getAllItems();
        })
        .catch((error) => {
          dispatch({ type: HIDE_LOADING });
          message.success("Something went wrong!");
          console.log(error);
        });
    }
  }

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
        <Button className="btn" onClick={() => setAddEditModalVisible(true)}>
          Add Items
        </Button>
      </div>

      {loading ? (
        <div className="spinner">
          <HashLoader color="#4e54c8" />
        </div>
      ) : (
        <Table columns={columns} dataSource={itemsData} bordered />
      )}
      {addEditModalVisible && (
        <Modal
          visible={addEditModalVisible}
          title={`${editingItem !== null ? "Edit Item" : "Add New Item"}`}
          footer={false}
          onCancel={() => {
            setEditingItem(null);
            setAddEditModalVisible(false);
          }}
        >
          <Form
            initialValues={editingItem}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item name={"name"} label="Name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name={"price"} label="Price">
              <Input placeholder="Price" />
            </Form.Item>
            <Form.Item name={"image"} label="Image URL">
              <Input placeholder="Image URL" />
            </Form.Item>
            <Form.Item name={"category"} label="Category">
              <Select>
                <Select.Option value="fruits">Fruits</Select.Option>
                <Select.Option value="vegetables">Vegetables</Select.Option>
                <Select.Option value="meat">Meat</Select.Option>
              </Select>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button className="btn" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
}
