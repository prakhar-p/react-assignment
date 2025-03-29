import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Typography, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users/${id}`);
        setUser(response.data.data);
      } catch (err) {
        toast.error("Failed to fetch user details");
      }
    };
    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      toast.success("User updated successfully");
      navigate("/users", { state: { updatedUser: user } });
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
          Edit User
        </Typography>
        <form onSubmit={handleUpdate}>
          <TextField
            fullWidth
            label="First Name"
            value={user.first_name}
            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={user.last_name}
            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Update
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditUser;
