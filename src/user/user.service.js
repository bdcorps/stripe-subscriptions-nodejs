const addUser = (User) => ({email, billingID, planType}) => {
  // if (!email || !billingID )
  //   throw new Error("Missing Data. Please provide values for title, author.");
  const book = new User({ email, billingID, planType });
  return book.save();
};

const getUsers = (User) => () => {
  return User.find({});
};

const getUserByEmail = (User) => async (email) => {
  return await User.findOne({ email });
};

const updatePlan = (User) => (email, planType) => {
  return User.findOneAndUpdate({ email, planType });
};

module.exports = (User) => {
  return {
    addUser: addUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
    updatePlan: updatePlan(User),
  };
};
