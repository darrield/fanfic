import { useState, type ChangeEvent, type FormEvent } from "react";
import { NavLink } from "react-router";
import ApiClient from "../../../utils/ApiClient";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

interface SignUpForm {
    username : string,
    email : string,
    password : string
}

function SignUp() {
    const [form, setForm] = useState<SignUpForm> ({
            username: "",
            email: "",
            password: ""
        })
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const onHandleChange = (event : ChangeEvent<HTMLInputElement>) => {
            const {name, value} = event.target
        
            setForm({
                ...form,
                [name] : value
            })
        }
    
    const onSubmit = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("")
        setErrorMessage("")
        try {
            const response = await ApiClient.post('/signup', form)
            console.log(response.data)
            setSuccessMessage("Signup successful! You can now sign in.")
            setTimeout(() => {
                window.location.href = "/auth/signIn"
            }, 2000)
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.")
        }
    }
    
   return (
    <div className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4 fw-bold">Join Fanfic Forge</h2>
                <p className="text-center text-muted mb-4">Create your account to start writing</p>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      value={form.username}
                      onChange={onHandleChange}
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      value={form.email}
                      onChange={onHandleChange}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={form.password}
                      onChange={onHandleChange}
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button type="submit" variant="primary" size="lg">
                      Sign Up
                    </Button>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-muted">Already have an account? </span>
                    <NavLink to="/auth/signIn" className="text-primary fw-bold text-decoration-none">
                      Sign In
                    </NavLink>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp