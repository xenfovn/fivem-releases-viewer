import type { RequestHandler } from './$types';
import type { ForumResponse, ForumUser, ProcessedTopic } from '$lib/types';
import { apiCache } from '$lib/cache';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	try {
		// Get filter and page parameters from URL
		const filter = url.searchParams.get('filter') || 'latest';
		const page = parseInt(url.searchParams.get('page') || '1');
		
		// Build the API URL based on filter
		let apiUrl = 'https://forum.cfx.re/c/releases/7';
		switch (filter) {
			case 'hot':
				apiUrl += '/l/hot.json';
				break;
			case 'top-weekly':
				apiUrl += '/l/top.json'; // Default is weekly
				break;
			case 'top-monthly':
				apiUrl += '/l/top.json?period=monthly';
				break;
			case 'top-quarterly':
				apiUrl += '/l/top.json?period=quarterly';
				break;
			case 'top-yearly':
				apiUrl += '/l/top.json?period=yearly';
				break;
			case 'top-all':
				apiUrl += '/l/top.json?period=all';
				break;
			default: // 'latest'
				apiUrl += '.json';
				break;
		}
		
		// Add page parameter to URL
		const urlObj = new URL(apiUrl);
		if (page > 1) {
			urlObj.searchParams.set('page', page.toString());
		}
		apiUrl = urlObj.toString();
		
		// Check if we have cached forum data for this filter and page
		const cacheKey = `forum-releases-${filter}-page-${page}`;
		let data: ForumResponse | null = apiCache.get<ForumResponse>(cacheKey);
		
		if (!data) {
			console.log(`📡 Fetching fresh forum data for ${filter} page ${page}...`);
			const response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			data = await response.json();
			// Cache for 5 minutes
			apiCache.set(cacheKey, data, 5);
		} else {
			console.log(`💾 Using cached forum data for ${filter} page ${page}`);
		}
		
		// At this point, data is guaranteed to be non-null
		const forumData = data as ForumResponse;
		
		// Create a map of user IDs to user objects for easy lookup
		const userMap = new Map<number, ForumUser>();
		forumData.users.forEach(user => {
			userMap.set(user.id, user);
		});
		
		// Filter out the "Releases Rules and FAQ" topic (ID: 240725) as it's not an actual release
		const filteredTopics = forumData.topic_list.topics.filter(topic => topic.id !== 240725);
		
		console.log(`🔍 Processing ${filteredTopics.length} topics for API request`);
		
		// Process all topics without previews (previews will be fetched on-demand)
		const allTopics: ProcessedTopic[] = filteredTopics.map((topic) => {
			// Get the original poster
			const originalPoster = topic.posters.find(p => p.description.includes('Original Poster'));
			const authorId = originalPoster?.user_id;
			const author = authorId ? userMap.get(authorId) : null;
			
			// Calculate time since posted
			const createdDate = new Date(topic.created_at);
			const now = new Date();
			const timeDiff = now.getTime() - createdDate.getTime();
			const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
			const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
			const minutesDiff = Math.floor(timeDiff / (1000 * 60));
			
			let timeAgo: string;
			if (daysDiff > 0) {
				timeAgo = `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
			} else if (hoursDiff > 0) {
				timeAgo = `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
			} else {
				timeAgo = `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
			}
			
			return {
				id: topic.id,
				title: topic.fancy_title.replace(/&amp;/g, '&').replace(/&hellip;/g, '…'),
				slug: topic.slug,
				author: author ? {
					username: author.username,
					avatar_template: author.avatar_template
				} : null,
				image_url: topic.image_url,
				created_at: topic.created_at,
				timeAgo,
				tags: topic.tags,
				views: topic.views,
				like_count: topic.like_count,
				posts_count: topic.posts_count,
				url: `https://forum.cfx.re/t/${topic.slug}/${topic.id}`
				// Preview will be fetched on-demand when modal is opened
			};
		});
		
		console.log(`✅ Processed ${allTopics.length} topics for API response`);
		
		// Determine if there are more pages
		const hasMorePages = forumData.topic_list.more_topics_url !== undefined && forumData.topic_list.more_topics_url !== null;
		
		return json({
			topics: allTopics,
			currentPage: page,
			hasMorePages,
			totalTopics: filteredTopics.length
		});
	} catch (error) {
		console.error('Error fetching forum data:', error);
		return json(
			{
				topics: [],
				currentPage: 1,
				hasMorePages: false,
				totalTopics: 0,
				error: 'Failed to load forum data'
			},
			{ status: 500 }
		);
	}
}; 