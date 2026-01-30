import { registerAs } from "@nestjs/config";

export default registerAs('kafka',()=>({
    host: process.env.KAFKA_HOST|| 'kafka',
    port: parseInt(process.env.KAFKA_PORT as string, 10) || 9092,
    password: process.env.KAFKA_PASSWORD || '8XQ>po=07oD)*m3GQ@aR',
    root: process.env.KAFKA_ROOT || 'user',
    clientId: process.env.KAFKA_CLIENT_ID || 'campus-management-system',
    sessionTimeout: parseInt(process.env.KAFKA_SESSION_TIMEOUT as string, 10) || 30000,
    heartbeatInterval: parseInt(process.env.KAFKA_HEARTBEAT_INTERVAL as string, 10) || 10000,
    retries: parseInt(process.env.KAFKA_RETRIES as string, 10) || 3,
    delay: parseInt(process.env.KAFKA_RETRY_DELAY as string, 10) || 100,
    autoCommit: process.env.KAFKA_AUTO_COMMIT === 'true' || false,
    commitInterval: parseInt(process.env.KAFKA_COMMIT_INTERVAL as string, 10) || 5000,
    threshold: parseInt(process.env.KAFKA_THRESHOLD as string, 10) || 100,
}));