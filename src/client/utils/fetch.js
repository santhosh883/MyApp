const send = (token, url, data, method) =>
  fetch(url, {
    headers: {
      'X-ISS-AuthToken': token,
      'Content-Type': 'application/json',
    },
    method: method,
    body: JSON.stringify(data),
  });

//Open when the endpoints are ready
// const urlSend = (token, url, method) =>
//   fetch(url, {
//     headers: {
//       'X-ISS-AuthToken': token,
//     },
//     method: method,
//   });

const data = [
  {
    name: 'Santosh',
    lastModifiedDate: '05/14/2018',
  },
  {
    name: 'Prakash',
    lastModifiedDate: '05/14/2018',
  },
];

const urlSend = (token, url, method) =>
  new Promise((resolve, reject) => {
    window.setTimeout(function() {
      const response = {};
      response.ok = true;
      response.status = 200;
      response.data = data;
      resolve(response);
    }, Math.random() * 2000 + 1000);
  });

export const get = (token, url) => urlSend(token, url, 'GET');
export const del = (token, url) => urlSend(token, url, 'DELETE');
export const post = (token, url, data) => send(token, url, data, 'POST');
export const put = (token, url, data) => send(token, url, data, 'PUT');
