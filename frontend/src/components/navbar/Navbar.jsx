import { useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Offcanvas from "react-bootstrap/Offcanvas";
import { NavLink,useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "./Navbar.css";
import axios from "axios";
import {API_URI} from '../Api/Api'
import { toast } from "react-toastify";
import logo from '../../assets/the_digital_diner.jpg';
import {useContextData} from '../../context/context';
import { Link } from "react-router-dom";


function OffcanvasExample() {
  const expand = "lg";
  const [isRegister,setIsRegister]=useState(false)
  const [show, setShow] = useState(false);

  const navigateHome=useNavigate(null)

  const {user,setUser}=useContextData()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [data,setData]=useState({
    username:'',
    email:'',
    password:''
  })
  const [searchValue,setSearchValue]=useState('')

  const changeHandler=(e)=> {
    setData({...data,[e.target.name]:e.target.value})
  }

  const [verifyBtn,setVerifyBtn]=useState(false)
  const [emailVerified,setEmailVerified]=useState(false)
  const [otp,setOtp]=useState('')

  const loginFuntion=()=> {
    const {email,password}=data
    axios.post(`${API_URI}/user/login-user`,{email,password},{withCredentials:true}).then(res=>{
      setUser(res.data.UserDetails)
      toast.success(res.data.msg)
      handleClose()
    }).catch(err=>toast.error(err.response.data.msg))
    setData({
      username:'',
      email:'',
      password:''
    })
  }
  
  const registerFuntion=()=> {
    const {username,email,password}=data
    axios.post(`${API_URI}/user/register-user`,{username,email,password}).then(res=>{
      toast.success(res.data.msg)
      setData({
        username:'',
        email:'',
        password:''
      })
    }).catch(err=>toast.error(err.response.data?.msg))
  }

  const logoutFuntion=()=> {
    axios.delete(`${API_URI}/user/logout-user`,{withCredentials:true}).then(res=>{
      toast.success(res.data.msg)
      setUser({})
      navigateHome('/')
    }).catch(err=>console.log(err))
  }

  const sendingOtp=()=> {
    const {email}=data
    axios.post(`${API_URI}/verification/send-otp`,{email}).then(res=>toast.success(res.data.msg)).catch(err=>toast.error(err.response?.data.msg))
    setEmailVerified(true)
  }
  const otpVerification=()=> {
    const {email}=data
    axios.post(`${API_URI}/verification/verify-otp`,{email,otp}).then(res=>{
      setEmailVerified(false)
      setVerifyBtn(true)
      toast.success(res.data.msg)
    }).catch(err=>toast.error(err.response?.data.msg))
  }

  return (
    <>
      <Navbar
        key={expand}
        expand={expand}
        className="bg-body-tertiary shadow fixed-top"
      >
        <Container>
          <Navbar.Brand href="#" className="fw-bold">
            <img src={logo} alt="swiggy" width="38px"/>
            {" "}The Digital Diner
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Swiggy
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-3 gap-lg-4 align-items-lg-center">
                <NavLink className="navLinks" to="/">Home</NavLink>
                
                <NavLink to="/cart" className="navLinks cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-cart"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                  </svg>
                  Cart
                </NavLink>
                
                {user?.username ? (
                  <NavLink className="navLinks" onClick={logoutFuntion}>
                    Logout
                  </NavLink>
                ) : (
                  <NavLink className="navLinks" onClick={handleShow}>
                    Login
                  </NavLink>
                )}
              </Nav>
              <Form className="d-flex mt-lg-0 mt-3" onSubmit={(e)=>e.preventDefault()}>
                <Form.Control
                  type="search"
                  placeholder="Enter Item name"
                  className="me-2"
                  aria-label="Search" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}
                />
                <Button variant="outline-success" type="submit">
                  <Link to={`/search/${searchValue}`} className="text-decoration-none">Search</Link>
                </Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onClick={(e)=>e.preventDefault()}>
          {isRegister&&<FloatingLabel
            controlId="floatingUsername"
            label="Enter Username"
            className="mb-3"
            required
          >
            <Form.Control
              type="email"
              placeholder="@"
              required name="username" value={data.username} onChange={changeHandler}
            />
            </FloatingLabel>}
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control
              type="email"
              placeholder="name@example.com"
              required name="email" value={data.email} onChange={changeHandler}
            />
             {isRegister && verifyBtn &&<button className="btn">Email verified</button>}
             {isRegister && !verifyBtn && <button className="btn text-decoration-underline fw-semibold" onClick={sendingOtp}>Send otp</button>}
          </FloatingLabel>
          {emailVerified && <FloatingLabel controlId="floatingOTP" label="Enter OTP" className="mb-3">
            <Form.Control type="text" placeholder="Password" value={otp} onChange={e=>setOtp(e.target.value)}/>
            <div className="text-center">
           <button className="btn btn-dark mt-1" onClick={otpVerification}>Verify</button>
           </div>
          </FloatingLabel>}
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              required name="password" value={data.password} onChange={changeHandler}
            />
          </FloatingLabel>
          </Form>
          <div className="text-center mt-3">
            {isRegister?<button className="btn btn-dark" onClick={registerFuntion}>
              Register
            </button>:<button className="btn btn-success" onClick={loginFuntion}>
              Login
            </button>}
          </div>
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {isRegister?<Button variant="primary" onClick={()=>setIsRegister(false)}>
            Login
          </Button>:<Button variant="primary" onClick={()=>setIsRegister(true)}>
            Register
          </Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OffcanvasExample;

