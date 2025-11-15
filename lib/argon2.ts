import { hash, verify, type Options } from "@node-rs/argon2";

const hashOptions: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const hashPassword = async (password: string) => {
  const result = await hash(password, hashOptions);
  return result;
};

export const verifyPassword = async (password: string, hash: string) => {
  const result = await verify(hash, password, hashOptions);
  return result;
};
