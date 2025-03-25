// File: src/LoginPage.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Box,
} from "@mui/material";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === "parent" && password === "WFRpassword123") {
      onLogin("admin");
    } else if (username === "child" && password === "12345") {
      onLogin("viewer");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "4rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Wolfe Family Rewards Tracking
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
