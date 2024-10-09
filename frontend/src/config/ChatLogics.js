// Function to calculate margin for the same sender
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id === m.sender._id && // Safeguard for undefined sender
    messages[i]?.sender?._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1]?.sender?._id !== m.sender._id &&
      messages[i]?.sender?._id !== userId) ||
    (i === messages.length - 1 && messages[i]?.sender?._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

// Function to check if the current message is from the same sender as the next one
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1]?.sender?._id !== m.sender._id || // Safeguard for undefined sender
      messages[i + 1]?.sender?._id === undefined) &&
    messages[i]?.sender?._id !== userId
  );
};

// Function to check if the message is the last message from another user
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1]?.sender?._id !== userId && // Safeguard for undefined sender
    messages[messages.length - 1]?.sender?._id
  );
};

// Function to check if the current message is from the same user as the previous one
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1]?.sender?._id === m.sender._id; // Safeguard for undefined sender
};

// Function to get the name of the sender (either the current user or another)
export const getSender = (loggedUser, users) => {
  if (!users || users.length === 0) return ""; // Safeguard for empty or null 'users' array
  return users[0]?._id === loggedUser._id ? users[1]?.name : users[0]?.name;
};

// Function to get full user object of the sender (other than logged in user)
export const getSenderFull = (loggedUser, users) => {
  if (!users || users.length === 0) return null; // Safeguard for empty or null 'users' array
  return users[0]?._id === loggedUser._id ? users[1] : users[0];
};
