// In-memory mock database for demo purposes
export const mockDB = {
  users: [],
  students: [],
  placements: [],
  notifications: [],
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const findUserByEmail = (email) => {
  return mockDB.users.find(u => u.email === email);
};

export const createUser = (userData) => {
  const newUser = {
    _id: generateId(),
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockDB.users.push(newUser);
  return newUser;
};

export const findUserById = (id) => {
  return mockDB.users.find(u => u._id === id);
};

export const getAllUsers = () => {
  return mockDB.users;
};

export const updateUser = (id, updates) => {
  const user = findUserById(id);
  if (user) {
    Object.assign(user, updates, { updatedAt: new Date() });
  }
  return user;
};

export const deleteUserById = (id) => {
  const index = mockDB.users.findIndex(u => u._id === id);
  if (index > -1) {
    return mockDB.users.splice(index, 1)[0];
  }
  return null;
};
