const LOCAL_ADDRESS = 'http://localhost:5000';
const PRODUCTION_ADDRESS = 'https://oichokabu-online.herokuapp.com'
const devEnv = import.meta.env.DEV;
export const serverAddress = devEnv? LOCAL_ADDRESS : PRODUCTION_ADDRESS;