const BaseUser = require('../../models/BaseUser')

const updateProfilePicture = async (userId, profilePicUrl) => {
    try {
      // Find the user by their ID and update the profilePicUrl
      const updatedUser = await BaseUser.findByIdAndUpdate(
        userId,
        { profilePicUrl },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('User not found');
      }
  
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };




module.exports = {
    updateProfilePicture,
}
  