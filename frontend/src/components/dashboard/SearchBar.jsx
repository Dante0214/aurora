import React from "react";
import { Box, TextField, MenuItem, Select, Button } from "@mui/material";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  showingResults,
  hasResults,
  onReset,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasResults && showingResults) {
      setSearchQuery("");
      setSelectedCategory("");
      await onReset();
    } else {
      onSearch();
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, mb: 2 }}
    >
      <TextField
        label="검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        displayEmpty
      >
        <MenuItem value="">전체</MenuItem>
        <MenuItem value="personal">개인 즐겨 찾기</MenuItem>
        <MenuItem value="work">업무 활용 자료</MenuItem>
        <MenuItem value="reference">참고 자료</MenuItem>
        <MenuItem value="education">교육 및 학습 자료</MenuItem>
      </Select>
      <Button type="submit" variant="contained">
        {!hasResults && showingResults ? "전체 목록 보기" : "검색"}
      </Button>
    </Box>
  );
};

export default SearchBar;
