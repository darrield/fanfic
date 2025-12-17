import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import ApiClient from "../../../utils/ApiClient";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router";

interface SignInForm {
    email : string,
    password : string
}

function SignIn() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState<SignInForm> ({
            email: "",
            password: ""
        })

    const onHandleChange = (event : ChangeEvent<HTMLInputElement>) => {
            const {name, value} = event.target
        
            setForm({
                ...form,
                [name] : value
            })
        }
    
    const onSubmit = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const response = await ApiClient.post('/signin', form)
            console.log(response.data)
            if (response.status == 200) {
                localStorage.setItem("AuthToken", response.data.data.token)
                navigate("/",
                    {replace : true
                })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }
    
   return (
    <div className="bg-dark text-white min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4 fw-bold">Welcome Back</h2>
                <p className="text-center text-muted mb-4">Sign in to continue to Fanfic Forge</p>
                <Form onSubmit={onSubmit}>
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
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-muted">Don't have an account? </span>
                    <NavLink to="/auth" className="text-primary fw-bold text-decoration-none">
                      Sign Up
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

export default SignIn