import { useState } from "react";
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const EditLinkForm = ({ link, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ ...link });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <ListItem
      component="form"
      onSubmit={handleSubmit}
      divider
      sx={{ display: "flex", alignItems: "center", gap: 2 }}
    >
      <ListItemText
        primary={
          <TextField
            fullWidth
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        }
        secondary={
          <TextField
            fullWidth
            size="small"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />
        }
      />
      <Select
        size="small"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="개인 즐겨 찾기">개인 즐겨 찾기</MenuItem>
        <MenuItem value="업무 활용 자료">업무 활용 자료</MenuItem>
        <MenuItem value="참고 자료">참고 자료</MenuItem>
        <MenuItem value="교육 및 학습 자료">교육 및 학습 자료</MenuItem>
      </Select>
      <IconButton type="submit">
        <CheckIcon />
      </IconButton>
      <IconButton onClick={onCancel}>
        <CloseIcon />
      </IconButton>
    </ListItem>
  );
};

export default EditLinkForm;
