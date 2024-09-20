const profilePicture = require('../common/common-services/profilePicture')

const updateProfilePicture = async (req, res) => {
    try {
      const userId = req.user.id; 
      const { profilePicUrl } = req.body; 
      console.log('profile picture being saved', profilePicUrl)

      if(!profilePicUrl) {
        throw Error
      }
      
      const updatedUser = await profilePicture.updateProfilePicture(userId, profilePicUrl);
      console.log('updated user...', updatedUser)
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile picture updated', profilePicUrl: updatedUser.profilePicUrl });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return res.status(500).json({ error: 'Failed to update profile picture' });
    }
  };


module.exports = {
    updateProfilePicture,
}