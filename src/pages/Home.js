import { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Col, Row } from "antd";
import Item from "../components/Item";
import "../../src/resources/items.css";
import { useDispatch } from "react-redux";
import { HIDE_LOADING, SHOW_LOADING } from "../redux/cartItems";

export default function Home() {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("fruits");
  const dispatch = useDispatch();

  const categories = [
    {
      name: "fruits",
      imageURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaVSaCcQy85soS7b-9Jhm9tRMf5B_U79SduQ&s",
    },
    {
      name: "vegetables",
      imageURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx1rsZxFYfJEAmnIuV9kCnmHV6IEvMdKE4AQ&s",
    },
    {
      name: "meat",
      imageURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNfv3HmHQvxFPW8l4leNp0fo5jprX1om3v9A&s",
    },
  ];

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

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <DefaultLayout>
      <div className="d-flex">
        {categories.map((category) => {
          return (
            <div
              onClick={() => setSelectedCategory(category.name)}
              className={`d-flex category ${
                selectedCategory === category.name && "selected-category"
              }`}
            >
              <h4>{category.name}</h4>
              <img src={category.imageURL} alt="image" width={80} height={60} />
            </div>
          );
        })}
      </div>

      <Row gutter={20}>
        {itemsData
          .filter((item) => item.category === selectedCategory)
          .map((item) => {
            return (
              <Col key={item._id} xs={24} lg={6} md={12} sm={6}>
                <Item item={item} />
              </Col>
            );
          })}
      </Row>
    </DefaultLayout>
  );
}
