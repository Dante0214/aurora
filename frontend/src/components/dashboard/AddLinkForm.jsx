import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

const AddLinkForm = ({ onAddLink }) => {
  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    category: "개인 즐겨 찾기",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddLink(newLink);
    setNewLink({ name: "", url: "", category: "개인 즐겨 찾기" });
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, alignItems: "center" }}
    >
      <TextField
        label="링크 제목"
        value={newLink.name}
        onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
        required
      />
      <TextField
        type="url"
        label="url"
        value={newLink.url}
        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
        required
      />

      <Select
        value={newLink.category}
        onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
      >
        <MenuItem value="개인 즐겨 찾기">개인 즐겨 찾기</MenuItem>
        <MenuItem value="업무 활용 자료">업무 활용 자료</MenuItem>
        <MenuItem value="참고 자료">참고 자료</MenuItem>
        <MenuItem value="교육 및 학습 자료">교육 및 학습자료</MenuItem>
      </Select>
      <Button type="submit" variant="contained" sx={{ height: "56px" }}>
        추가
      </Button>
    </Box>
  );
};

export default AddLinkForm;
