import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaIdCard } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "fullname":
        errorMsg = value.length >= 3 && value.length <= 50 ? "" : "Full Name must be between 3 and 50 characters";
        break;

      case "username":
        errorMsg = /^[a-zA-Z0-9]{4,20}$/.test(value) 
          ? "" 
          : "Username must be 4-20 characters (letters/numbers only)";
        break;

      case "email":
        errorMsg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
          ? "" 
          : "Enter a valid email address";
        break;

      case "password":
        errorMsg = /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(value)
          ? ""
          : "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (Object.values(errors).some((err) => err) || Object.values(formData).some((field) => !field.trim())) {
      setError("Please fix the errors before submitting.");
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      setSuccess("User successfully registered. Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(to right, #e3f2fd, #ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      {/* ✅ Background Image */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: 'url("https://source.unsplash.com/1600x900/?tasks,productivity") center/cover',
          opacity: 0.2,
          zIndex: -1
        }}
      />

      <Container>
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto">
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Header className="text-center bg-primary text-white fw-bold" style={{ fontSize: "1.4rem" }}>
                Create an Account
              </Card.Header>
              <Card.Body className="p-4">
                
                {/* ✅ Motivational Quote */}
                <p className="text-center text-muted fw-bold" style={{ fontSize: "1.1rem", fontStyle: "italic" }}>
                  "Start your journey to productivity today!"
                </p>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && <Alert variant="success" className="text-center">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  
                  {/* ✅ Full Name Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaIdCard /></span>
                      <Form.Control
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        isInvalid={!!errors.fullname}
                      />
                      <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* ✅ Username Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUser /></span>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        isInvalid={!!errors.username}
                      />
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* ✅ Email Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* ✅ Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLock /></span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  {/* ✅ Register Button */}
                  <Button 
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-2 fw-bold"
                    style={{ fontSize: "1.1rem" }}
                    disabled={loading || Object.values(errors).some((err) => err) || Object.values(formData).some((field) => !field.trim())}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : "Register"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="mb-1 text-muted">Already have an account?</p>
                  <Button variant="link" onClick={() => navigate("/login")} className="fw-bold">
                    Login Here
                  </Button>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
