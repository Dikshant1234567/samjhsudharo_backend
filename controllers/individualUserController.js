import IndividualUser from "../models/IndividualUser.js";

export const registerIndividual = async (req, res) => {
  try {
    const { firstName, lastName, email, password, domain, description, city, state, country } = req.body;

    const userExists = await IndividualUser.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await IndividualUser.create({
      firstName,
      lastName,
      email,
      password,
      domain,
      description,
      city,
      state,
      country,
    });

    res.status(201).json({
      message: "Individual user registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getIndividuals = async (req, res) => {
  try {
    
    const users = await IndividualUser.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginIndividual = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await IndividualUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare plain text password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await IndividualUser.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await IndividualUser.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = req.body.firstName ?? user.firstName;
    user.lastName = req.body.lastName ?? user.lastName;
    user.description = req.body.description ?? user.description;
    user.city = req.body.city ?? user.city;
    user.state = req.body.state ?? user.state;
    user.country = req.body.country ?? user.country;
    if (Array.isArray(req.body.domain)) {
      user.domain = req.body.domain;
    }

    const updated = await user.save();
    const sanitized = {
      id: updated._id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      domain: updated.domain,
      description: updated.description,
      city: updated.city,
      state: updated.state,
      country: updated.country,
    };
    return res.status(200).json(sanitized);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
