import React from "react";
import LinkItem from "./LinkItem";
import { Box, Container, List, Typography } from "@mui/material";

const LinkList = ({
  links,
  onEdit,
  onShare,
  onDelete,
  canEditLink,
  currentUser,
}) => {
  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          내 즐겨찾기 목록
        </Typography>
        <List>
          {links.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onEdit={onEdit}
              onShare={onShare}
              onDelete={onDelete}
              canEditLink={canEditLink}
              currentUser={currentUser}
            />
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default LinkList;
