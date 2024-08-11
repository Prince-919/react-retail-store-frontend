import DefaultLayout from "../components/DefaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../src/resources/items.css";
import { useDispatch, useSelector } from "react-redux";
import { HIDE_LOADING, SHOW_LOADING } from "../redux/cartItems";
import { Table } from "antd";
import { HashLoader } from "react-spinners";

export default function Customers() {
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.rootReducer);

  function getAllBills() {
    dispatch({ type: SHOW_LOADING });
    axios
      .get("https://retail-store-api-mzdn.onrender.com/api/bills/get-all")
      .then((response) => {
        dispatch({ type: HIDE_LOADING });
        setBillsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: HIDE_LOADING });
        console.log(error);
      });
  }

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },

    {
      title: "Created On",
      dataIndex: "createdAt",
      render: (value) => <span>{value.toString().substring(0, 10)}</span>,
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
    },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Customers</h3>
      </div>

      {loading ? (
        <div className="spinner">
          <HashLoader color="#4e54c8" />
        </div>
      ) : (
        <Table columns={columns} dataSource={billsData} bordered />
      )}
    </DefaultLayout>
  );
}
