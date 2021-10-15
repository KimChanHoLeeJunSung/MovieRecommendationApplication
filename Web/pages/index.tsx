import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  function validateForm() {
    return name.length > 0 && password.length > 0
  }

  function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
  }
  function checkLogin(){
    sessionStorage.setItem('userId',name)
    alert('Login Success')
    router.push('/startPage')
  }

  return (
    <div className = "container2">
      <div className = "header">Movie Recommendation System</div>
      <div className="login">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label className = 'password'>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button  type="submit" disabled={!validateForm()} className = 'loginButton'
                  onClick = {() => {checkLogin()}}>
              Login
          </Button>
          <Button variant = "outline-primary" className = 'signUpButton'
                  onClick = {()=> {router.push('/signUp')}}>Sign up</Button>
        </Form>
      </div>
    </div>
  );
}