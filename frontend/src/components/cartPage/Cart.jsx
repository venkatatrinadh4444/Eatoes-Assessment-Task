import { useEffect, useState } from "react";
import "./Cart.css";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useContextData } from "../../context/context";
import axios from "axios";
import { API_URI } from "../Api/Api";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const Cart = () => {
  const navigateHome = useNavigate(null);
  const [cartItems, setCartItems] = useState([]);
  const { user, setUser } = useContextData();
  const [clickOrder, setClickOrder] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const orderChangeDetailsHandler = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!user.username) {
    toast.warning("You need to be logged in to access cart.");
    return <Navigate to="/" />;
  }

  const gettingCartItems = () => {
    axios
      .get(`${API_URI}/user/fetch-cart-items`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.msg);
        setCartItems(res.data.cartItems);
      })
      .catch((err) => console.log(err));
  };

  const gettingOrderedItems = () => {
    axios
      .get(`${API_URI}/user/fetch-ordered-items`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.msg);
        setOrderDetails(res.data.orderedItems);
      })
      .catch((err) => toast.error(err.response.data?.msg));
  };

  useEffect(() => {
    if (!clickOrder) gettingCartItems();
    if (clickOrder) gettingOrderedItems();
  }, [clickOrder]);

  const removeCartItem = (cartItemId) => {
    axios
      .delete(`${API_URI}/user/delete-cart-item/${cartItemId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.msg);
        gettingCartItems();
      })
      .catch((err) => toast.error(err.response.data?.msg));
  };

  const goToHome = () => {
    toast("Navigate to home");
    navigateHome("/");
  };

  const checkoutFuntion = () => {
    axios
      .post(`${API_URI}/user/checkout`, orderDetails, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.msg)
        setClickOrder(true)
        handleClose();
      })
      .catch((err) => toast.error(err.response.data?.msg));
  };

  return (
    <div className="container mt-2">
      <h3 className="text-center text-success">Cart</h3>
      <hr />
      <div className="flex mb-3">
        <button
          className="btn btn-primary w-50"
          onClick={() => setClickOrder(false)}
          disabled={clickOrder ? false : true}
        >
          Cart Items
        </button>
        <button
          className="btn btn-success w-50"
          onClick={() => setClickOrder(true)}
          disabled={clickOrder ? true : false}
        >
          Ordered Items
        </button>
      </div>
      {!clickOrder && (
        <div className="sectionContainer">
          {cartItems.length > 0 ? (
            cartItems.map((eachItem) => {
              return (
                <div
                  className="d-flex justify-content-between align-items-center container cartContainer shadow mb-2"
                  key={eachItem._id}
                >
                  <div>
                    <img
                      src={eachItem.image}
                      alt={eachItem.name}
                      width="80px"
                      height="60px"
                    />
                    <button className="btn">
                      Quantity:{eachItem.quantity}
                    </button>
                  </div>
                  <div>
                    <h5>{eachItem.name}</h5>
                    <h6>Price:&#8377;{eachItem.price}</h6>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(eachItem._id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center">
              <img
                src="https://img.freepik.com/free-vector/supermarket-shopping-cart-concept-illustration_114360-22408.jpg?t=st=1740720165~exp=1740723765~hmac=2b73df6e9492d558399354a3f61517c904a82b20db37c1e6d6ba34aa349e49ce&w=1380"
                alt="empty cart"
                width="180px"
                height="200px"
              />
            </div>
          )}
        </div>
      )}

      {clickOrder && (
        <div className="bg-info-subtle shadow px-3 py-2 rounded">
          {orderDetails.length > 0 &&
            orderDetails.map((eachItem) => {
              return (
                <div key={eachItem._id}>
                  <div>
                    <div className="d-flex justify-content-between">
                      <div className="fw-medium">
                        <p className="p-0 m-0">Name:{eachItem.name}</p>
                        <p className="p-0 m-0">Phone:{eachItem.phone}</p>
                        <p className="p-0 m-0">Address:{eachItem.address}</p>
                      </div>
                      <div className="fw-medium">
                        <p className="p-0 m-0">
                          Total Items:{eachItem.items?.length}
                        </p>
                        <p className="p-0 m-0">Total Amount:{eachItem.total}</p>
                      </div>
                    </div>
                  </div>
                  {eachItem.items.map((eachOrder) => {
                    return (
                      <div className="d-flex align-items-center my-2 fw-medium gap-2" key={eachOrder._id}>
                        <img
                          src={eachOrder.image}
                          alt=""
                          width="60px"
                          height="60px"
                          className="orderItemImages"
                        />
                        <div>
                          <p className="m-0 p-0">{eachOrder.name}</p>
                          <p className="m-0 p-0">{eachOrder.price}</p>
                        </div>
                      </div>
                    );
                  })}
                  <hr/>
                </div>
              );
            })}
        </div>
      )}

      {!clickOrder && cartItems.length > 0 ? (
        <div className="d-flex justify-content-between align-items-center footer mb-5">
          <div className="d-flex align-items-center">
            <h6>Total Cart Items:</h6>
            <h5>{cartItems.length}</h5>
          </div>
          <div>
            <button className="btn btn-primary" onClick={handleShow}>
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-3 mb-5">
          <button className="btn btn-primary" onClick={goToHome}>
            Go Home
          </button>
        </div>
      )}

      {/* Payment form for chechkout */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter order details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <>
            <FloatingLabel
              controlId="floatingInputName"
              label="Enter name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="name"
                required
                name="name"
                value={orderDetails.name}
                onChange={orderChangeDetailsHandler}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingInpurPhone"
              label="Enter contact number"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="phone"
                required
                name="phone"
                value={orderDetails.phone}
                onChange={orderChangeDetailsHandler}
              />
            </FloatingLabel>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Enter address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                name="address"
                value={orderDetails.address}
                onChange={orderChangeDetailsHandler}
              />
            </Form.Group>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={checkoutFuntion}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Cart;
