import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Link,
} from "@mui/material";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/login", { username, password });
      // console.log(response.data);
      localStorage.setItem("access_token", response.data.access_token);
      nav("/dashboard");
    } catch (error) {
      alert("로그인 실패");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          로그인
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            label="아이디"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="비밀번호"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            로그인
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          계정이 없나요? <Link href="/register">회원가입</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
