// Auth endpoints
export const LOGIN = "https://localhost:5001/api/Accounts/auth"
export const REFRESH = "https://localhost:5001/api/Accounts/refreshToken"
export const RESET = "https://localhost:5001/api/Accounts/authcode"
export const FORGOT = "https://localhost:5001/api/Accounts/forgotPassword"
export const RESETPASSWORD = "https://localhost:5001/api/Accounts/me/resetPassword"
export const CHANGEMYPASSWORD = "https://localhost:5001/api/Accounts/me/changePassword"
// Directory endpoints
export const MEMBERS = "https://localhost:5001/api/Directory/members";
export const FRIENDSHIP = (memberId: string) =>  `https://localhost:5001/api/Directory/members/${memberId}/friends`;