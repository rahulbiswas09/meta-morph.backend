export const createUniqueHandle = async (base) => {
  return base + Math.floor(Math.random() * 10000);
};


export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().replace("T", " ").substring(0, 19);
};

export const isValidEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
};
