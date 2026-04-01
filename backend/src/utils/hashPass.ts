import bcrypt from "bcrypt";

export const hashPass = async (password: string): Promise<any> => {
  const salt = 10;
  return await bcrypt.hash(password, salt);
};

export const comparePass = async (
  pass: string,
  hashPass: string,
): Promise<any> => {
  return await bcrypt.compare(pass, hashPass);
};
