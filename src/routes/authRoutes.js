router.post('/login', async (req, res) => {
    try {
        const { contactEmail, password } = req.body;

        console.log(`Login Attempt: ${contactEmail}`); // Debugging log

        const user = await User.findOne({ contactEmail });
        if (!user) {
            console.log("User not found!");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log(`User found: ${user.contactEmail}, Role: ${user.role}`);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            console.log("Password mismatch!");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("Login successful!");

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, userId: user._id, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});
