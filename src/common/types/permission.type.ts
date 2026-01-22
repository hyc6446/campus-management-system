// 先定义TypeScript类型，用于显式注解
export type CaslConditionValue = 
  | string
  | number
  | boolean
  | null
  | CaslConditionValue[]
  | { [key: string]: CaslConditionValue | CaslConditionOperator }

export interface CaslConditionOperator {
  $eq?: CaslConditionValue
  $ne?: CaslConditionValue
  $gt?: CaslConditionValue
  $gte?: CaslConditionValue
  $lt?: CaslConditionValue
  $lte?: CaslConditionValue
  $in?: CaslConditionValue[]
  $nin?: CaslConditionValue[]
  $contains?: CaslConditionValue
  $startsWith?: CaslConditionValue
  $endsWith?: CaslConditionValue
}


