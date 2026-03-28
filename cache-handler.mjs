import { Redis } from 'ioredis';

const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
client.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

export default class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    try {
      const result = await client.get(key);
      if (!result) return null;
      return JSON.parse(result);
    } catch (err) {
      console.error('Redis GET error:', err.message);
      return null;
    }
  }

  async set(key, data, ctx) {
    try {
      await client.set(key, JSON.stringify({
        value: data,
        lastModified: Date.now(),
        tags: ctx.tags,
      }));
    } catch (err) {
      console.error('Redis SET error:', err.message);
    }
  }

  async revalidateTag(tag) {
    // Keep stub for revalidateTag. Implementing full tag mapping requires complex Redis Sets logic
    // which shouldn't block the app.
  }
}
