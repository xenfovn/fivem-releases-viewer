interface CacheItem<T> {
	data: T;
	timestamp: number;
	ttl: number; // Time to live in milliseconds
}

class SimpleCache {
	private cache = new Map<string, CacheItem<unknown>>();
	
	set<T>(key: string, data: T, ttlMinutes: number = 10): void {
		const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl
		});
	}
	
	get<T>(key: string): T | null {
		const item = this.cache.get(key);
		if (!item) return null;
		
		// Check if item has expired
		if (Date.now() - item.timestamp > item.ttl) {
			this.cache.delete(key);
			return null;
		}
		
		return item.data as T;
	}
	
	has(key: string): boolean {
		const item = this.cache.get(key);
		if (!item) return false;
		
		// Check if item has expired
		if (Date.now() - item.timestamp > item.ttl) {
			this.cache.delete(key);
			return false;
		}
		
		return true;
	}
	
	clear(): void {
		this.cache.clear();
	}
	
	size(): number {
		return this.cache.size;
	}
	
	// Clean up expired items
	cleanup(): void {
		const now = Date.now();
		for (const [key, item] of this.cache.entries()) {
			if (now - item.timestamp > item.ttl) {
				this.cache.delete(key);
			}
		}
	}
}

// Create global cache instance
export const apiCache = new SimpleCache();

// Cleanup expired items every 5 minutes
if (typeof setInterval !== 'undefined') {
	setInterval(() => {
		apiCache.cleanup();
	}, 5 * 60 * 1000);
} 