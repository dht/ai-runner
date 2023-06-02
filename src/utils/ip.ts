const os = require('os');

export const getIP = () => {
  const networkInterfaces = os.networkInterfaces();

  for (let i in networkInterfaces) {
    for (let details of networkInterfaces[i]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
};

export const isSameNetwork = (ip: string) => {
  const thisMachineIP = getIP();

  const arrIP1 = thisMachineIP.split('.');
  const arrIP2 = ip.split('.');

  return arrIP1[0] === arrIP2[0] && arrIP1[1] === arrIP2[1] && arrIP1[2] === arrIP2[2];
};

export const cleanIp = (ip: string) => {
  const arr = ip.split(':');
  return arr[arr.length - 1];
};
