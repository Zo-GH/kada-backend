const profilePic = require('../common/common-services/profilePicture')

const updateProfilePicture = async (req, res) => {
    try {
      const userId = req.user.id; 
      const { profilePicture } = req.body; 
      console.log('profile picture being saved', profilePicture)

      if(!profilePicture) {
        throw Error
      }
      
      const updatedUser = await profilePic.updateProfilePicture(userId, profilePicture);
      console.log('updated user...', updatedUser)
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile picture updated', profilePicture: updatedUser.profilePicture });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return res.status(500).json({ error: 'Failed to update profile picture' });
    }
  };


module.exports = {
    updateProfilePicture,
}