// Utility functions for handling real-time notifications

// Send notification to users in a specific location
export const sendLocationNotification = (io, post) => {
  const { district, state, country } = post.location;
  
  // Send to district level (most specific)
  if (district) {
    io.to(`district_${district}`).emit('newPost', {
      type: 'NEW_POST',
      message: `New post in your district: ${post.title}`,
      post
    });
  }
  
  // Send to state level
  if (state) {
    io.to(`state_${state}`).emit('newPost', {
      type: 'NEW_POST',
      message: `New post in your state: ${post.title}`,
      post
    });
  }
  
  // Send to country level (least specific)
  if (country) {
    io.to(`country_${country}`).emit('newPost', {
      type: 'NEW_POST',
      message: `New post in your country: ${post.title}`,
      post
    });
  }
};

// Send notification for post updates
export const sendPostUpdateNotification = (io, post, updateType) => {
  const { district, state, country } = post.location;
  
  const notificationTypes = {
    VOLUNTEER: 'Someone volunteered for a post',
    COMMENT: 'New comment on a post',
    STATUS_CHANGE: 'Post status updated',
    PRIORITY_CHANGE: 'Post priority updated'
  };
  
  const message = `${notificationTypes[updateType]}: ${post.title}`;
  
  // Send to all relevant location rooms
  if (district) io.to(`district_${district}`).emit('postUpdate', { type: updateType, message, post });
  if (state) io.to(`state_${state}`).emit('postUpdate', { type: updateType, message, post });
  if (country) io.to(`country_${country}`).emit('postUpdate', { type: updateType, message, post });
};

export default {
  sendLocationNotification,
  sendPostUpdateNotification
};