import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AddLinkForm from "./AddLinkForm";
import LinkList from "./LinkList";
import ShareModal from "./ShareModal";
import { Box, Button, Container, Typography } from "@mui/material";

const Dashboard = () => {
  const nav = useNavigate();
  const [links, setLinks] = useState([]);
  const [shareInfo, setShareInfo] = useState({
    linkId: null,
    username: "",
    canWrite: false,
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [shares, setShares] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [linksRes, usersRes, currentUserRes] = await Promise.all([
        api.get("/api/links"),
        api.get("/api/users"),
        api.get("/api/me"),
      ]);

      setLinks(linksRes.data);
      setUsers(usersRes.data);
      setCurrentUser(currentUserRes.data.username);
    } catch (error) {
      console.error("데이터 가져오기 실패", error);
    }
  };

  const fetchShares = async (linkId) => {
    try {
      const response = await api.get(`/api/links/${linkId}/shares`);
      setShares(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message || "공유 정보를 가져오는데 실패했습니다"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  const handleDelete = async (linkId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await api.delete(`/api/links/${linkId}`);
        setLinks(links.filter((link) => link.id !== linkId));
        alert("링크가 삭제되었습니다");
      } catch (error) {
        alert(error.response?.data?.message || "링크 삭제에 실패했습니다");
      }
    }
  };

  const handleAddLink = async (newLink) => {
    try {
      await api.post("/api/links", newLink);
      const linksRes = await api.get("/api/links");
      setLinks(linksRes.data);
    } catch (error) {
      alert(error.response?.data?.message || "링크 추가에 실패했습니다");
    }
  };

  const handleEdit = async (updatedLink) => {
    try {
      await api.put(`/api/links/${updatedLink.id}`, {
        name: updatedLink.name,
        url: updatedLink.url,
        category: updatedLink.category,
      });
      const linksRes = await api.get("/api/links");
      setLinks(linksRes.data);
      alert("링크가 수정되었습니다");
    } catch (error) {
      alert(error.response?.data?.message || "링크 수정에 실패했습니다");
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/links/${shareInfo.linkId}/share`, {
        username: shareInfo.username,
        can_write: shareInfo.canWrite,
      });
      alert("링크가 공유되었습니다");
      setShowShareModal(false);
      setShareInfo({ linkId: null, username: "", canWrite: false });
    } catch (error) {
      alert(error.response?.data?.message || "링크 공유에 실패했습니다");
    }
  };

  const handleUnshare = async (username) => {
    if (window.confirm(`${username}님의 공유를 취소하시겠습니까?`)) {
      try {
        await api.delete(`/api/links/${shareInfo.linkId}/unshare/${username}`);
        await fetchShares(shareInfo.linkId);
        alert("공유가 취소되었습니다");
      } catch (error) {
        alert(error.response?.data?.message || "공유 취소에 실패했습니다");
      }
    }
  };

  const canEditLink = (link) => {
    return (
      link.created_by === currentUser ||
      shares.some((share) => share.username === currentUser && share.can_write)
    );
  };

  const openShareModal = async (linkId) => {
    const link = links.find((l) => l.id === linkId);
    if (!canEditLink(link)) {
      alert("공유할 권한이 없습니다.");
      return;
    }
    setShareInfo({ ...shareInfo, linkId });
    setShowShareModal(true);
    await fetchShares(linkId);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {currentUser && (
          <Typography variant="h4" component="h2">
            {currentUser} dashboard
          </Typography>
        )}
        <Button
          color="error"
          sx={{ alignSelf: "flex-end" }}
          onClick={handleLogout}
        >
          로그아웃
        </Button>

        <AddLinkForm onAddLink={handleAddLink} />

        <LinkList
          links={links}
          onEdit={handleEdit}
          onShare={openShareModal}
          onDelete={handleDelete}
          canEditLink={canEditLink}
          currentUser={currentUser}
        />

        {showShareModal && (
          <ShareModal
            shareInfo={shareInfo}
            setShareInfo={setShareInfo}
            users={users}
            shares={shares}
            onShare={handleShare}
            onUnshare={handleUnshare}
            onClose={() => setShowShareModal(false)}
            open={showShareModal}
          />
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
