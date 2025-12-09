import { Token } from "@prisma/client";


export type TokenSelect ={
  [K in keyof Token]?:boolean
}
// 动态返回类型
// export type TokenWithFields<T extends TokenSelect> = {
//   [K in keyof T as T[K] extends true ? K : never]: Token[K];
// };
export type TokenWithFields<T extends TokenSelect> = {
  [K in keyof T as T[K] extends true ? K : never]: Token[K & keyof Token];
};