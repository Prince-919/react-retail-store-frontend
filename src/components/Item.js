import { Button } from "antd";
import { ADD_TO_CART } from "../redux/cartItems";
import { useDispatch } from "react-redux";

export default function Item({ item }) {
  const dispatch = useDispatch();

  function addToCart() {
    dispatch({ type: ADD_TO_CART, payload: { ...item, quantity: 1 } });
  }

  return (
    <div className="item">
      <h4 className="name">{item.name}</h4>
      <div className="img">
        <img src={item.image} alt="image" height={100} width={100} />
      </div>
      <h4 className="price">
        <strong>Prince: </strong>
        {item.price} $/-
      </h4>
      <div className="d-flex justify-content-end">
        <Button onClick={() => addToCart()}>Add To Cart</Button>
      </div>
    </div>
  );
}
