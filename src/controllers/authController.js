exports.login = async (req, res, next) => {
  try {
    let { contactEmail, password } = req.body;

    if (!contactEmail || !password) {
      console.log("Login error: Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Ensure email is formatted correctly
    contactEmail = contactEmail.trim().toLowerCase();
    console.log(`Login Attempt: ${contactEmail}`);

    // Check if email exists in database
    const user = await User.findOne({ contactEmail });

    if (!user) {
      console.log("User not found in DB for:", contactEmail);
      
      // Debugging: Log all users to verify stored emails
      const allUsers = await User.find({}, { contactEmail: 1 });
      console.log("All Users in DB:", allUsers);
      
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log(`User found: ${user.contactEmail}, Role: ${user.role}`);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log(`bcrypt.compare result: ${isMatch}`);

    if (!isMatch) {
      console.log("Password mismatch!");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("Login successful!");

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
