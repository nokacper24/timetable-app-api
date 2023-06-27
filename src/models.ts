export interface UserFull {
    id: number;
    username: string;
    passwordhash: string;
    role: string;
  }

  export interface User {
    username: string;
    role: string;
  }