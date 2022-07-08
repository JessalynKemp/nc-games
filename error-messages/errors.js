exports.tooManyProps = (requestBody, ...props) => {
  for (const bodyProp in requestBody) {
    if (!props.includes(bodyProp)) {
      const errorStr = props.join(" and ");
      let isAre = "";
      props.length > 1 ? (isAre = "are") : (isAre = "is");
      return Promise.reject({
        status: 400,
        msg: `only ${errorStr} ${isAre} required`,
      });
    }
  }
};

exports.missingProps = (requestBody, ...props) => {
  let missingProps = [];
  let errStr = "";
  let lastProp = "";

  for (let i = 0; i < props.length; i++) {
    if (requestBody[props[i]] === undefined) {
      missingProps.push(props[i]);
    }
  }
  if (missingProps.length === 0) {
    return;
  }

  if (missingProps.length > 2) {
    extraProp = missingProps.pop();
  }

  missingProps.length > 2
    ? (errorStr = missingProps.join(", ") + `and $extraProp`)
    : (errorStr = missingProps.join(" and "));

  return Promise.reject({
    status: 400,
    msg: `${errorStr} not provided`,
  });
};

exports.notFound = (param) => {
  return Promise.reject({ status: 404, msg: `${param} not found` });
};

exports.notNumber = (param) => {
  return Promise.reject({ status: 400, msg: `${param} must be a number` });
};

exports.notString = (param) => {
  return Promise.reject({ status: 400, msg: `${param} must be a string` });
};

exports.notProvided = (...params) => {
  const errorStr = params.join(" and ");
  return Promise.reject({
    status: 400,
    msg: `${errorStr} not provided`,
  });
};

exports.cannotSort = (param) => {
  return Promise.reject({ status: 400, msg: `cannot sort by ${param}` });
};
