import React from "react";
import SharesList from "./ShareList";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const ShareModal = ({
  shareInfo,
  setShareInfo,
  users,
  shares,
  onShare,
  onUnshare,
  onClose,
  open,
}) => {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          링크 공유 관리
        </Typography>
        <Box component="form" onSubmit={onShare}>
          <FormControl fullWidth>
            <InputLabel>공유할 사용자 선택</InputLabel>
            <Select
              value={shareInfo.username}
              onChange={(e) =>
                setShareInfo({ ...shareInfo, username: e.target.value })
              }
              required
            >
              <MenuItem value="" disabled>
                공유할 사용자 선택
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.username} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={shareInfo.canWrite}
                onChange={(e) =>
                  setShareInfo({ ...shareInfo, canWrite: e.target.checked })
                }
              />
            }
            label="수정 권한 부여"
          ></FormControlLabel>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            공유하기
          </Button>
        </Box>
        <SharesList shares={shares} onUnshare={onUnshare} />
      </Box>
    </Modal>
  );
};

export default ShareModal;
