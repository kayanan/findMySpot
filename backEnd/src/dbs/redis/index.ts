import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import logger from '@/src/dbs/logger';
import config from '@/config';

let redisClient: RedisClientType;

const redisConnect = async () => {
  try {
    // Creating Redis Client
    redisClient = createClient({
      url: config.redis.cache.url,
    });
    // Handling Events on Redis Connection
    redisClient.on('connect', () => {
      logger.info('Redis Server Connected');
    });
    redisClient.on('ready', () => {
      logger.info('Redis client is ready to send commands');
    });
    redisClient.on('error', (err) => {
      logger.error(`Redis Client Error ${err.message}`);
    });
    redisClient.on('end', () => {
      logger.info('Redis Server Connection Terminated');
    });
    await redisClient.connect();
  } catch (error) {
    logger.error(error);
  }
};

const setCacheValue = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await redisClient.set(key, value);
    logger.info(`Key "${key}" set successfully`);
  } catch (error) {
    logger.error(`Error setting key "${key}": ${error.message}`);
  }
};

const getCacheValue = async (key: string): Promise<string | null> => {
  try {
    const value = await redisClient.get(key);
    logger.info(`Key "${key}" retrieved with value: ${value}`);
    return value;
  } catch (error) {
    logger.error(`Error retrieving key "${key}": ${error.message}`);
    return null;
  }
};

const deleteCacheKey = async (key: string): Promise<void> => {
  try {
    const result = await redisClient.del(key);
    logger.info(`Key "${key}" deleted successfully: ${result}`);
  } catch (error) {
    logger.error(`Error deleting key "${key}": ${error.message}`);
  }
};
export {
  redisConnect,
  redisClient,
  getCacheValue,
  setCacheValue,
  deleteCacheKey,
};
