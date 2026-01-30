export const kafkaTopicsConfig = [
  {
    topic: 'business-logs',
    numPartitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'message-notifications',
    numPartitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'system-logs',
    numPartitions: 1,
    replicationFactor: 1,
  },
]

export type KafkaTopicType = (typeof kafkaTopicsConfig)[number]['topic']

export enum KafkaTopics {
  BusinessLogs = 'business-logs',
  MessageNotifications = 'message-notifications',
  SystemLogs = 'system-logs',
}
