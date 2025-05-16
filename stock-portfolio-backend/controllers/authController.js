const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed!" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (!user.length) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user[0].id, is_admin: user[0].is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed!" });
    }
};

exports.getProfile = async (req, res) => {
    const userId = req.user.id; // From JWT
    try {
        const [user] = await db.query("SELECT id, username, email FROM users WHERE id = ?", [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user[0]);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile!" });
    }
};

exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id; // From JWT

    try {
        const [result] = await db.query("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From JWT

    try {
        const [user] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
        if (!user.length) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
};

exports.getAdminDashboard = async (req, res) => {
    try {
        // Admin-specific logic to get dashboard info
        res.status(200).json({ message: "Admin dashboard data here" });
    } catch (error) {
        console.error("Error fetching admin dashboard:", error);
        res.status(500).json({ error: "Failed to fetch admin dashboard!" });
    }
};