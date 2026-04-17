export enum UserRoleENUM {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export interface LoggedInUser {
  id: string;
  fullname: string;
  email: string;
  position?: string;
  role?: UserRoleENUM;
}
