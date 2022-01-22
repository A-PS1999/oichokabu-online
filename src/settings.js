const LOCAL_ADDRESS = 'http://localhost:5000';
const PRODUCTION_ADDRESS = 'http://www.placeholder-address.com'
export const devEnv = process.env.REACT_APP_ENV === 'development';
export const serverAddress = devEnv? LOCAL_ADDRESS : PRODUCTION_ADDRESS;