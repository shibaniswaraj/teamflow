import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";
import AvatarCircle from "../components/AvatarCircle";
import { fetchMyProfile, updateMyProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});


  useEffect(() => {
    async function loadProfile() {
      const data = await fetchMyProfile();
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
    }
    loadProfile();
  }, []);

 const handleSave = async () => {
  const newErrors = {};

  if (!name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Invalid email format";
  }

  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }

  await updateMyProfile({ name, email });
  navigate("/dashboard");
};


  if (!profile) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ width: 480, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Settings
        </Typography>

        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <AvatarCircle
            name={profile.name}
            email={profile.email}
            size={64}
          />
        </Box>

        {/* Name */}
       <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          error={!!errors.name}
          helperText={errors.name}
          onChange={e => {
            setName(e.target.value);
            setErrors(prev => ({ ...prev, name: null }));
          }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          error={!!errors.email}
          helperText={errors.email}
          onChange={e => {
            setEmail(e.target.value);
            setErrors(prev => ({ ...prev, email: null }));
          }}
        />


        {/* Role (read-only) */}
        <TextField
          label="Role"
          fullWidth
          margin="normal"
          value={profile.role}
          disabled
        />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </Button>

          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
