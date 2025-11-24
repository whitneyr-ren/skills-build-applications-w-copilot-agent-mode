import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

function Home() {
  return (
    <div className="container py-4">
      <h1 className="display-5">OctoFit Tracker</h1>
      <p className="lead">Select a section from the navigation to view data.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Container fluid>
            <Navbar.Brand as={NavLink} to="/">OctoFit</Navbar.Brand>
            <Navbar.Toggle aria-controls="mainNav" />
            <Navbar.Collapse id="mainNav">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/activities">Activities</Nav.Link>
                <Nav.Link as={NavLink} to="/leaderboard">Leaderboard</Nav.Link>
                <Nav.Link as={NavLink} to="/teams">Teams</Nav.Link>
                <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                <Nav.Link as={NavLink} to="/workouts">Workouts</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
        <footer className="text-center text-muted footer-muted">OctoFit Tracker &copy; 2025</footer>
      </Router>
    </div>
  );
}
