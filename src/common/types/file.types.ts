/**
 * 文件上传相关类型定义
 * 注意：此类型基于multer的File接口，当multer包更新时需要同步更新
 */
export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  // 增加索引签名以增加灵活性
  [key: string]: any;
}