import { compare, hash } from "bcrypt";

export const hashPassword = (password: string) => {
  const saltRounds: number = 10;
  return hash(password, saltRounds);
};

export const validateUser = (
  userPasswordProvided: string,
  storedPassword: string
) => {
  return compare(userPasswordProvided, storedPassword);
};
