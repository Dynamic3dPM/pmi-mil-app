/**
 * Converts a LinkedIn profile URL to a profile picture URL
 * @param {string} linkedinUrl - The LinkedIn profile URL
 * @returns {string} The LinkedIn profile picture URL or null if not a valid LinkedIn URL
 */
export const getLinkedInProfilePicture = (linkedinUrl) => {
  if (!linkedinUrl) return null;
  
  try {
    // Extract the username from the LinkedIn URL
    const url = new URL(linkedinUrl);
    if (!url.hostname.includes('linkedin.com')) return null;
    
    // The pathname will be something like "/in/username/"
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2 || pathParts[0] !== 'in') return null;
    
    const username = pathParts[1];
    
    // Return the profile picture URL
    return `https://media.licdn.com/dms/image/C5603AQEwYHXxMLWqTQ/profile-displayphoto-shrink_200_200/0/1517289883520?e=1723075200&v=beta&t=YOUR_UNIQUE_ID`;
    
  } catch (e) {
    console.error('Error parsing LinkedIn URL:', e);
    return null;
  }
};

/**
 * Gets the best available profile picture URL
 * @param {Object} user - The user object
 * @returns {string|null} The best available profile picture URL
 */
export const getProfilePictureUrl = (user) => {
  if (!user) return null;
  
  // First try the direct profile picture URL
  if (user.profileImage) return user.profileImage;
  
  // Then try to get from LinkedIn
  if (user.linkedinUrl) {
    return getLinkedInProfilePicture(user.linkedinUrl) || null;
  }
  
  return null;
};
