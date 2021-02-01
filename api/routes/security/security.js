import { sqlInstance } from '../../index.js';

export async function checkToken(token, id) {
  return await sqlInstance.request('SELECT * FROM USERS WHERE TOKEN = ? AND ID = ?', [token, id]).then(result => {
    return result.length > 0;
  });
}