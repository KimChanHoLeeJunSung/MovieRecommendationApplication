import React, { useState } from "react";
import {Form, Button} from "react-bootstrap";
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [v, setV] = useState<string>("")
  const [correctPW, setCorrectPW] = useState<boolean>(false);
  const [isSame, setIsSame] = useState<boolean>(false);

  async function signUpUser(){
      const response = await fetch('/api/user/save',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: name,
              password: password,
          })
      })
      .then((response) => {
        const data = response.json()
        console.log(data)
        alert('Sign Up Success')
        router.push('../')
      })
      .catch(()=>{alert("Error")})
  }

  function chkPW(e: { target: { value: string; }; }){
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*+=]).{8,}$/;
    if(false === reg.test(e.target.value))
        setCorrectPW(false);
    else
        setCorrectPW(true);
    if(v !== e.target.value)
        setIsSame(false);
    else
        setIsSame(true);
  }

  function chkSame(e: { target: { value: string; }; }){
    if(password !== e.target.value) {
        setIsSame(false);
    }else {
        setIsSame(true);
    }
  }

  function validateForm() {
    return name.length > 0 && password.length > 0 && v.length > 0 && isSame && correctPW
  }

  function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
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
          <Form.Group controlId="password" className="position-relative">
            <Form.Label className = 'password'>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} isInvalid = {password !== '' && !correctPW}
              onChange={(e) => {setPassword(e.target.value); chkPW(e);}}
            />
            <Form.Control.Feedback type="invalid" tooltip>
                The password must contain at least one number, one lowercase letter, one uppercase letter and one special character (!@#$%^&*+=), and at least 8 characters.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="position-relative">
            <Form.Label className = 'password'>Validate Password</Form.Label>
            <Form.Control
              type="password" isInvalid = {v !== '' && !isSame}
              onChange={(e) => {setV(e.target.value); chkSame(e);}}
            />
            <Form.Control.Feedback type="invalid" tooltip>
                Not Same
            </Form.Control.Feedback>
          </Form.Group>
          <Button  className = 'loginButton' onClick = {() => {router.push('../')}}>
              Back
          </Button>
          <Button variant = "outline-primary" className = 'signUpButton' 
                  disabled={!validateForm()} onClick ={signUpUser}>
              Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}