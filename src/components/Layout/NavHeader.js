import React from "react";
import {NavLink} from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

const Header = (props) => {
  return (
    <>
      <Navbar className="fw-bold shadow" expand="sm" variant="dark" bg="success" fixed="top">
        <Container>
            <Navbar.Brand href="/">ExpenseTracker.</Navbar.Brand>
            <Nav className="ms-auto">
              <>
              <NavLink exact to="/auth" style={{textDecoration:'none', margin:'0.5rem', color:'#ffffff'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-person" viewBox="0 0 16 16">
                <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
                <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              </svg>
                SignUp
              </NavLink>
              </>
            </Nav>

        </Container>
      </Navbar>
    </>
  );
};

export default Header;