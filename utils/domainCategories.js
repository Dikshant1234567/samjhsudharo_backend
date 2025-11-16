// Social welfare domain categories
export const socialWelfareDomains = [
  "Education and Literacy",
  "Health and Sanitation",
  "Environment and Sustainability",
  "Poverty Alleviation and Livelihood",
  "Human Rights and Equality",
  "Child and Youth Welfare",
  "Elderly and Disabled Care",
  "Rural and Community Development",
  "Disaster Relief and Emergency Aid",
  "Technology and Digital Empowerment"
];

// Get all domain categories
export const getDomainCategories = () => {
  return socialWelfareDomains;
};

// Validate if a domain is valid
export const isValidDomain = (domain) => {
  return socialWelfareDomains.includes(domain);
};

export default {
  socialWelfareDomains,
  getDomainCategories,
  isValidDomain
};