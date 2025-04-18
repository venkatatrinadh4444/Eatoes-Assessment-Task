import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import { itemData } from "../../pages/data/data";
import axios from "axios";
import "./LandingPage.css";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URI } from "../../components/Api/Api";

const LandingPage = () => {
  const imagesContainer = useRef(null);
  const [data, setData] = useState([]);
  const [clikedCategory, setClikedCategory] = useState("all");

  const sliceHandler = (direction) => {
    const sliceAmount = 300;

    if (direction === "right") {
      imagesContainer.current.scrollTo({
        left: imagesContainer.current.scrollLeft + sliceAmount,
        behavior: "smooth",
      });
    } else if (direction === "left") {
      imagesContainer.current.scrollTo({
        left: imagesContainer.current.scrollLeft - sliceAmount,
        behavior: "smooth",
      });
    }
  };

  const foodCategories = [
    "all",
    "south-indian",
    "north-indian",
    "chinese",
    "bakery",
  ];

  const categorySelection = (value) => {
    setClikedCategory(value);
    toast(`Showing ${value} restaurants`)
  };

  useEffect(() => {
    axios
      .get(`${API_URI}/firm/get-firms/${clikedCategory}`)
      .then((res) =>{
        setData(res.data.filteredFirms)
      })
      .catch((err) => console.log(err));
  }, [clikedCategory]);

  return (
    <div>
      <Navbar />
      <div className="d-flex container mt-5 pt-3">
        {itemData.map((eachImage) => {
          const { item_img } = eachImage;
          return (
            <div key={item_img}>
              <img
                src={`https://venkatatrinadh4444.github.io/swiggy-clone${item_img}`}
                alt={item_img}
                width="100%"
              />
            </div>
          );
        })}
      </div>

      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="pt-2">Top restaurant chains in India</h4>
          <div className="d-flex gap-3">
            <button
              className="btn pr-3 pt-1 btn-dark"
              onClick={() => sliceHandler("left")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="18"
                fill="currentColor"
                className="bi bi-arrow-left-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>
            </button>
            <button
              className="btn btn-success pr-3 pt-1"
              onClick={() => sliceHandler("right")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-arrow-right-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="chainContainer" ref={imagesContainer}>
          {data &&
            data.map((eachItem) => {
              return (
                <div className="imageContainer" key={eachItem._id}>
                  <Link to={`/products/${eachItem._id}`}className="text-decoration-none">
                    <img
                      src={eachItem.image}
                      alt={eachItem.firmName}
                      width="100%"
                    />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>

      <div className="container mt-3">
      <h4>Restaurants with online food delivery in Hyderabad</h4>
      <div className="d-flex justify-content-between btnContainer mb-3">
        {foodCategories && foodCategories.map(eachCategory=>{
          return <button className="btn shadow btn-secondary px-md-4" key={eachCategory} onClick={()=>categorySelection(eachCategory)}>{eachCategory}</button>
        })}
      </div>

      <div className="itemsContainer pb-4">
        {data?.length>0 &&(
          data.map((eachItem) => {
            return (
              <Link to={`/products/${eachItem._id}`} key={eachItem._id}className="text-decoration-none">
                <Card style={{ width: "15rem" }} className="cardContainer">
                  <div className="cardImageContainer">
                    <img
                      src={eachItem.image}
                      width="100%"
                    />
                    <h5 className="cardHeading ps-2">
                      {eachItem.offer}
                    </h5>
                  </div>
                  <Card.Body className="p-0 ps-3 pb-2 pt-1">
                    <Card.Title>{eachItem.firmName}</Card.Title>
                    <Card.Subtitle className="text-secondary">
                      {eachItem.region}
                    </Card.Subtitle>
                    <Card.Subtitle className="text-secondary">
                      {eachItem.area}
                    </Card.Subtitle>
                  </Card.Body>
                </Card>
              </Link>
            );
          })
        )}
        {!data?.length>0 && <div className="w-100 text-center">
          <h4 className="mt-2">No restaurants found</h4>
          <p>Please select another region restaurents.</p>
          </div>}
      </div>
    </div> 
    </div>
  );
};
export default LandingPage;
