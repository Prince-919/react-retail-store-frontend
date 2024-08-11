import DefaultLayout from "../components/DefaultLayout";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../src/resources/items.css";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_LOADING, SHOW_LOADING } from "../redux/cartItems";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { HashLoader } from "react-spinners";
import ReactToPrint, { useReactToPrint } from "react-to-print";

export default function Bills() {
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisible, setPrintBillModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.rootReducer);
  const componentRef = useRef();

  function getAllBills() {
    dispatch({ type: SHOW_LOADING });
    axios
      .get("https://retail-store-api-mzdn.onrender.com/api/bills/get-all")
      .then((response) => {
        dispatch({ type: HIDE_LOADING });
        const data = response.data;
        data.reverse();
        setBillsData(data);
      })
      .catch((error) => {
        dispatch({ type: HIDE_LOADING });
        console.log(error);
      });
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
    },

    {
      title: "Tax",
      dataIndex: "tax",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
    },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            style={{
              color: "#4e54c8",
            }}
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisible(true);
            }}
          />
        </div>
      ),
    },
  ];

  const cartcolumns = [
    {
      title: "Name",
      dataIndex: "name",
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
          <b
            style={{
              color: "#495057",
            }}
          >
            {record.quantity}
          </b>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <b
            style={{
              color: "#495057",
            }}
          >
            {record.quantity * record.price}
          </b>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Bills</h3>
      </div>

      {loading ? (
        <div className="spinner">
          <HashLoader color="#4e54c8" />
        </div>
      ) : (
        <Table columns={columns} dataSource={billsData} bordered />
      )}
      {printBillModalVisible && (
        <Modal
          visible={printBillModalVisible}
          title="Bill Details"
          footer={false}
          onCancel={() => {
            setPrintBillModalVisible(false);
          }}
          width={800}
        >
          <div className="bill-modal p-3" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <h1>
                  <strong>PS Market</strong>
                </h1>
              </div>
              <div>
                <p>Bihar</p>
                <p>Mohania 821109</p>
                <p>+91-9199683605</p>
              </div>
            </div>
            <div className="bill-customer-details my-2">
              <p>
                <strong>Name </strong>: {selectedBill.customerName}
              </p>
              <p>
                <strong>Phone Number </strong>: {selectedBill.phoneNumber}
              </p>
              <p>
                <strong>Name </strong>:{" "}
                {selectedBill.createdAt.toString().substring(0, 10)}
              </p>
            </div>
            <Table
              columns={cartcolumns}
              dataSource={selectedBill.cartItems}
              pagination={false}
            />
            <div className="bill-header pb-2 my-2">
              <p>
                <strong>Sub Total </strong>: {selectedBill.subTotal}
              </p>
              <p>
                <strong>Tax </strong>: {selectedBill.tax}
              </p>
            </div>
            <div className="mt-2">
              <h2>
                <strong>Grand Total </strong>: {selectedBill.totalAmount}
              </h2>
            </div>
            <div className="bill-header my-2"></div>
            <div className="text-center">
              <p>Thanks</p>
              <p>Visit Again :)</p>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button className="btn" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
}
