import GroupUser from "../models/GroupUser.js";

export const registerGroup = async (req, res) => {
  try {
    const { organizationName, email, password, domain, description, city, state, country, contactNumber } = req.body;

    const groupExists = await GroupUser.findOne({ email });
    if (groupExists) {
      return res.status(400).json({ message: "Group already exists" });
    }

    const newGroup = await GroupUser.create({
      organizationName,
      email,
      password,
      domain,
      description,
      city,
      state,
      country,
      contactNumber,
    });

    res.status(201).json({
      message: "Group user registered successfully",
      group: newGroup,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await GroupUser.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
