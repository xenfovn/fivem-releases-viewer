import type { RequestHandler } from './$types';
import type { TopicDetailResponse } from '$lib/types';
import { apiCache } from '$lib/cache';
import { json } from '@sveltejs/kit';

interface PreviewData {
	preview: string;
	youtubeLinks: string[];
	tebexLinks: string[];
}

function extractLinks(html: string): { youtubeLinks: string[], tebexLinks: string[] } {
	const youtubeLinks: string[] = [];
	const tebexLinks: string[] = [];
	
	// Extract YouTube links (various formats)
	const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/gi;
	let youtubeMatch;
	while ((youtubeMatch = youtubeRegex.exec(html)) !== null) {
		const videoId = youtubeMatch[1];
		const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
		if (!youtubeLinks.includes(fullUrl)) {
			youtubeLinks.push(fullUrl);
		}
	}
	
	// Extract Tebex links - limit to first link found
	const tebexRegex = /https?:\/\/[a-zA-Z0-9.-]*\.?tebex\.io\/[^\s<>"']*/gi;
	const tebexMatch = tebexRegex.exec(html);
	if (tebexMatch) {
		tebexLinks.push(tebexMatch[0]);
	}
	
	return { youtubeLinks, tebexLinks };
}

function cleanAndFormatHTML(html: string): string {
	// Remove dangerous elements and scripts
	let cleaned = html
		.replace(/<script[^>]*>.*?<\/script>/gis, '')
		.replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
		.replace(/<object[^>]*>.*?<\/object>/gis, '')
		.replace(/<embed[^>]*>/gi, '')
		.replace(/<link[^>]*>/gi, '')
		.replace(/<meta[^>]*>/gi, '')
		.replace(/<style[^>]*>.*?<\/style>/gis, '');
	
	// Remove all images and image-related content
	cleaned = cleaned
		.replace(/<img[^>]*>/gi, '') // Remove img tags
		.replace(/<figure[^>]*>.*?<\/figure>/gis, '') // Remove figure elements (often contain images)
		.replace(/<picture[^>]*>.*?<\/picture>/gis, '') // Remove picture elements
		.replace(/<source[^>]*>/gi, '') // Remove source tags
		.replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown-style images
		.replace(/\[img\].*?\[\/img\]/gi, '') // Remove BBCode images
		.replace(/\[screenshot\].*?\[\/screenshot\]/gi, ''); // Remove screenshot tags
	
	// Keep basic formatting tags and convert some forum-specific elements
	cleaned = cleaned
		// Convert forum quotes to blockquotes
		.replace(/<aside class="quote[^>]*>.*?<\/aside>/gis, (match) => {
			const content = match.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
			return `<blockquote class="forum-quote">${content}</blockquote>`;
		})
		// Convert code blocks
		.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '<pre class="code-block">$1</pre>')
		.replace(/<code[^>]*>(.*?)<\/code>/gis, '<code class="inline-code">$1</code>')
		// Keep basic formatting
		.replace(/<div[^>]*>/gi, '<div>')
		.replace(/<span[^>]*>/gi, '<span>')
		// Remove other attributes but keep the tags
		.replace(/<(p|br|strong|b|em|i|u|ul|ol|li|h[1-6])[^>]*>/gi, '<$1>')
		// Clean up extra whitespace
		.replace(/\s+/g, ' ')
		.trim();
	
	// Remove any remaining unknown tags while preserving content
	cleaned = cleaned
		.replace(/<(?!\/?(p|br|strong|b|em|i|u|ul|ol|li|h[1-6]|div|span|blockquote|pre|code)\b)[^>]*>/gi, '')
		.replace(/\s+/g, ' ')
		.trim();
	
	return cleaned;
}

export const GET: RequestHandler = async ({ params, fetch, url }) => {
	const topicId = params.id;
	const slug = url.searchParams.get('slug');
	
	if (!topicId || !slug) {
		return json({ error: 'Missing topic ID or slug' }, { status: 400 });
	}
	
	const previewCacheKey = `topic-preview-${topicId}`;
	
	try {
		// Check cache first
		const cachedPreview = apiCache.get<PreviewData | string>(previewCacheKey);
		if (cachedPreview !== null) {
			console.log(`💾 Using cached preview for topic ${topicId}`);
			// Handle both old string format and new object format
			if (typeof cachedPreview === 'string') {
				return json({ preview: cachedPreview, youtubeLinks: [], tebexLinks: [] });
			}
			return json(cachedPreview);
		}
		
		console.log(`📡 Fetching preview for topic ${topicId}...`);
		const topicResponse = await fetch(`https://forum.cfx.re/t/${slug}/${topicId}.json`);
		
		if (!topicResponse.ok) {
			// Cache failure to avoid repeated requests
			apiCache.set(previewCacheKey, { preview: '', youtubeLinks: [], tebexLinks: [] }, 5);
			return json({ error: 'Failed to fetch topic' }, { status: topicResponse.status });
		}
		
		const topicData: TopicDetailResponse = await topicResponse.json();
		const firstPost = topicData.post_stream.posts.find(post => post.post_number === 1);
		
		if (firstPost?.cooked) {
			// Extract links from the original HTML before cleaning
			const { youtubeLinks, tebexLinks } = extractLinks(firstPost.cooked);
			
			// Clean and format HTML content
			const cleanedHTML = cleanAndFormatHTML(firstPost.cooked);
			
			// Extract plain text for length checking
			const textContent = cleanedHTML.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
			
			let preview = cleanedHTML;
			
			// If text is too long, truncate while preserving HTML structure
			if (textContent.length > 1000) {
				// Try to find a good breaking point by looking for paragraph or heading endings
				const htmlParts = cleanedHTML.match(/<\/(?:p|h[1-6]|li|blockquote)>/gi);
				
				if (htmlParts && htmlParts.length > 0) {
					// Find paragraphs/sections that fit within character limit
					let truncatedHTML = '';
					let charCount = 0;
					
					// Split by paragraph endings and rebuild
					const sections = cleanedHTML.split(/(<\/(?:p|h[1-6]|li|blockquote)>)/gi);
					
					for (let i = 0; i < sections.length; i += 2) {
						const content = sections[i] || '';
						const closingTag = sections[i + 1] || '';
						const sectionText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
						
						if (charCount + sectionText.length > 1000) break;
						
						truncatedHTML += content + closingTag;
						charCount += sectionText.length;
					}
					
					if (truncatedHTML.trim()) {
						preview = truncatedHTML;
					} else {
						// Fallback to first paragraph if no complete sections fit
						const firstParagraph = cleanedHTML.match(/<p[^>]*>.*?<\/p>/i);
						if (firstParagraph) {
							const pText = firstParagraph[0].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
							if (pText.length > 1000) {
								const truncated = pText.substring(0, 1000).trim();
								const lastSpace = truncated.lastIndexOf(' ');
								const finalText = lastSpace > 800 ? truncated.substring(0, lastSpace) : truncated;
								preview = `<p>${finalText}...</p>`;
							} else {
								preview = firstParagraph[0];
							}
						} else {
							// Ultimate fallback
							const shortText = textContent.substring(0, 1000).trim();
							const lastSpace = shortText.lastIndexOf(' ');
							const finalText = lastSpace > 800 ? shortText.substring(0, lastSpace) : shortText;
							preview = `<p>${finalText}...</p>`;
						}
					}
				} else {
					// No structured HTML found, fallback to text truncation
					const shortText = textContent.substring(0, 1000).trim();
					const lastSpace = shortText.lastIndexOf(' ');
					const finalText = lastSpace > 800 ? shortText.substring(0, lastSpace) : shortText;
					preview = `<p>${finalText}...</p>`;
				}
			}
			
			// Create response object with preview and extracted links
			const responseData = {
				preview,
				youtubeLinks,
				tebexLinks
			};
			
			// Cache the preview data for 15 minutes
			apiCache.set(previewCacheKey, responseData, 15);
			
			return json(responseData);
		}
		
		// No content found, cache empty result
		const emptyResult = { preview: '', youtubeLinks: [], tebexLinks: [] };
		apiCache.set(previewCacheKey, emptyResult, 15);
		return json(emptyResult);
		
	} catch (error) {
		console.error(`Failed to fetch preview for topic ${topicId}:`, error);
		// Cache failure to avoid repeated requests
		apiCache.set(previewCacheKey, { preview: '', youtubeLinks: [], tebexLinks: [] }, 5);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}; 