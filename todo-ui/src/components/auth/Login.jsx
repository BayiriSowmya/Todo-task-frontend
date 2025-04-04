import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await authService.login(formData.username, formData.password);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      const user = {
        userId: response.userId,
        username: response.username,
        role: response.role
      };
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div 
      style={{
        height: '100vh',
        width: '100%',
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)', // ✅ Keeping your background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* ✅ Background image for To-Do theme */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'url("https://source.unsplash.com/1600x900/?productivity,tasks") center/cover',
          opacity: 0.2,
          zIndex: -1
        }}
      />

      <Container>
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto">
            <Card className="shadow-lg rounded-3 border-0">
              <Card.Header className="text-center bg-primary text-white fw-bold" style={{ fontSize: '1.4rem' }}>
                Welcome Back!
              </Card.Header>
              <Card.Body className="p-4">
                {/* ✅ Motivational Quote */}
                <p className="text-center text-muted fw-bold" style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "Stay organized, stay productive!" ✨
                </p>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUser /></span>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                        className="rounded-2"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLock /></span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="rounded-2"
                      />
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 rounded-2 fw-bold" style={{ fontSize: '1.1rem' }}>
                    Login
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <p className="mb-1 text-muted">Don't have an account?</p>
                  <Button variant="link" onClick={handleRegisterClick} className="fw-bold">
                    Register Here
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

export default Login;