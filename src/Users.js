import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Avatar, Button, Container, Grid, Box, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { toast } from "react-toastify";
import { useMediaQuery } from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const updatedUser = location.state?.updatedUser;
  const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screen size

  useEffect(() => {
    fetchUsers();
  }, [page, updatedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      let userData = response.data.data;

      if (updatedUser) {
        userData = userData.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      }

      setUsers(userData);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" sx={{ my: 3, fontWeight: "bold" }}>
        User List
      </Typography>

      {isMobile ? (
        // 📱 Mobile View (List Format)
        <List>
          {users.map((user) => (
            <ListItem key={user.id} sx={{ borderBottom: "1px solid #ddd", py: 1 }}>
              <ListItemAvatar>
                <Avatar src={user.avatar} sx={{ width: 50, height: 50 }} />
              </ListItemAvatar>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} secondary={user.email} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button size="small" variant="contained" color="primary" onClick={() => navigate(`/edit/${user.id}`)}>
                  Edit
                </Button>
                <Button size="small" variant="contained" color="error" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        // 💻 Desktop View (Card Format)
        <Grid container spacing={3} sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}> {/* 3 cards per row in large screens */}
              <Card sx={{ display: "flex", alignItems: "center", width: "100%", p: 2, boxShadow: 3 }}>
                <Avatar src={user.avatar} sx={{ width: 70, height: 70, mr: 2 }} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </CardContent>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button size="small" variant="contained" color="primary" onClick={() => navigate(`/edit/${user.id}`)}>
                    Edit
                  </Button>
                  <Button size="small" variant="contained" color="error" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" color="primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setPage(page + 1)} sx={{ ml: 2 }}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default Users;
