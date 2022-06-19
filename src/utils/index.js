const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return String(email).toLowerCase().match(regex);
};

const debounce = function (fn, d) {
  let timer;

  return function () {
    let context = this;
    let args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, d);
  };
};

function hash(...args) {
  let h = 0;
  let i = 0;

  if (args.length === 1) {
    for (i = 0; i < args[0].length; i++) {
      h = (h * 31 + args[0].charCodeAt(i)) & 0xffffffff;
    }
    return h;
  }

  for (i in args) {
    h ^= hash(args[i]);
  }
  return h;
}

const to = async (promis) => {
  try {
    const data = await promis;
    return [data, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

export { validateEmail, debounce, hash, to };
