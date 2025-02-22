import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
} from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/register", { username, password });
      alert("회원가입 성공");
      nav("/");
    } catch (error) {
      alert("회원가입 실패");
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
          회원가입
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            type="text"
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            회원가입
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <Link href="/">로그인 화면으로</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
