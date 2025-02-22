import React, { useState } from "react";
import EditLinkForm from "./EditLinkForm";
import { Link, ListItem, ListItemText, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const LinkItem = ({ link, onEdit, onShare, onDelete, canEditLink }) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    if (canEditLink(link)) {
      setIsEditing(true);
    } else {
      alert("권한이 없습니다");
    }
  };
  if (isEditing) {
    return (
      <EditLinkForm
        link={link}
        onSubmit={(updatedLink) => {
          onEdit(updatedLink);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ListItem
      divider
      secondaryAction={
        <>
          {" "}
          <IconButton edge="end" onClick={handleEdit} aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            onClick={() => onShare(link.id)}
            aria-label="share"
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            edge="end"
            onClick={() => onDelete(link.id)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="primary"
            variant="h6"
          >
            {link.name}
          </Link>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary" noWrap>
              {link.url}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {link.category}
            </Typography>
            <Typography variant="caption">작성자 {link.created_by}</Typography>
          </>
        }
      />
    </ListItem>
  );
};

export default LinkItem;
