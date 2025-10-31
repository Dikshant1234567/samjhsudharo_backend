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
