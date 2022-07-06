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
