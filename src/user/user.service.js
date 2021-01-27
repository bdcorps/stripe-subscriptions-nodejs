const addUser = (User) => ({ email, billingID, plan, endDate }) => {
  if (!email || !billingID || !plan) { throw new Error('Missing Data. Please provide values for email, billingID, plan') }

  const user = new User({ email, billingID, plan, endDate })
  return user.save()
}

const getUsers = (User) => () => {
  return User.find({})
}

const getUserByEmail = (User) => async (email) => {
  return await User.findOne({ email })
}

const getUserByBillingID = (User) => async (billingID) => {
  return await User.findOne({ billingID })
}

const updatePlan = (User) => (email, plan) => {
  return User.findOneAndUpdate({ email, plan })
}

module.exports = (User) => {
  return {
    addUser: addUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
    updatePlan: updatePlan(User),
    getUserByBillingID: getUserByBillingID(User)
  }
}
