import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const SharesList = ({ shares, onUnshare }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">현재 공유 중인 사용자</Typography>
      {shares.length === 0 ? (
        <Typography color="textSecondary">공유된 사용자가 없습니다.</Typography>
      ) : (
        <List>
          {shares.map((share) => (
            <ListItem
              key={share.username}
              secondaryAction={
                <Button
                  variant="outlined"
                  onClick={() => onUnshare(share.username)}
                >
                  공유 취소
                </Button>
              }
            >
              <ListItemText
                primary={share.username}
                secondary={share.can_write ? "(수정 가능)" : "(읽기 전용)"}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
export default SharesList;
