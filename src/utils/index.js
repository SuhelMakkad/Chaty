const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return String(email).toLowerCase().match(regex);
};

const to = async (promis) => {
  try {
    const data = await promis;
    return [data, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

export { to, validateEmail };
