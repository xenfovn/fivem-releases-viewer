<script lang="ts">
	import type { ProcessedTopic } from '$lib/types';
	import Modal from './Modal.svelte';
	
	export let topic: ProcessedTopic;
	
	let showModal = false;
	let previewContent: string | null = null;
	let youtubeLinks: string[] = [];
	let tebexLinks: string[] = [];
	
	$: titleInfo = cleanTitle(topic.title);
	let loadingPreview = false;
	let previewError = false;
	let cardElement: HTMLElement;
	
	function getAvatarUrl(template: string, size: number = 48): string {
		if (template.startsWith('http')) {
			return template.replace('{size}', size.toString());
		}
		return `https://forum.cfx.re${template}`.replace('{size}', size.toString());
	}
	
	function formatNumber(num: number): string {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		return num.toString();
	}

	function getYouTubeVideoId(url: string): string | null {
		const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		return (match && match[7].length === 11) ? match[7] : null;
	}

	function getResourceTypeClass(tags: string[]): string {
		const lowerTags = tags.map(tag => tag.toLowerCase());
		if (lowerTags.includes('paid')) {
			return 'resource-paid';
		} else if (lowerTags.includes('free')) {
			return 'resource-free';
		}
		return '';
	}

	function replaceDiscourseEmojis(text: string): string {
		// Common Discourse emoji text replacements
		const emojiReplacements: Record<string, string> = {
			':clapper:': '🎬',
			':pick:': '⛏️',
			':boom:': '💥',
			':fire:': '🔥',
			':heart:': '❤️',
			':star:': '⭐',
			':thumbsup:': '👍',
			':thumbsdown:': '👎',
			':+1:': '👍',
			':-1:': '👎',
			':smile:': '😊',
			':wink:': '😉',
			':cry:': '😢',
			':laugh:': '😂',
			':grin:': '😁',
			':cool:': '😎',
			':angry:': '😠',
			':confused:': '😕',
			':surprised:': '😲',
			':shock:': '😱',
			':sad:': '😢',
			':joy:': '😂',
			':love:': '😍',
			':kiss:': '😘',
			':rocket:': '🚀',
			':car:': '🚗',
			':phone:': '📱',
			':computer:': '💻',
			':money:': '💰',
			':gem:': '💎',
			':crown:': '👑',
			':gift:': '🎁',
			':party:': '🎉',
			':cake:': '🎂',
			':pizza:': '🍕',
			':beer:': '🍺',
			':coffee:': '☕',
			':sun:': '☀️',
			':moon:': '🌙',
			':rainbow:': '🌈',
			':cloud:': '☁️',
			':lightning:': '⚡',
			':snowflake:': '❄️',
			':tree:': '🌳',
			':flower:': '🌸',
			':music:': '🎵',
			':game:': '🎮',
			':sports:': '⚽',
			':trophy:': '🏆',
			':medal:': '🏅',
			':key:': '🔑',
			':lock:': '🔒',
			':unlock:': '🔓',
			':hammer:': '🔨',
			':wrench:': '🔧',
			':tools:': '🛠️',
			':gun:': '🔫',
			':bomb:': '💣',
			':knife:': '🔪',
			':shield:': '🛡️',
			':warning:': '⚠️',
			':stop:': '🛑',
			':check:': '✅',
			':x:': '❌',
			':question:': '❓',
			':exclamation:': '❗',
			':bulb:': '💡',
			':speech:': '💬',
			':mag:': '🔍',
			':book:': '📖',
			':newspaper:': '📰',
			':page:': '📄',
			':email:': '📧',
			':mailbox:': '📬',
			':package:': '📦',
			':calendar:': '📅',
			':clock:': '🕐',
			':hourglass:': '⏳',
			':alarm:': '⏰'
		};

		let result = text;
		
		// Replace emoji codes
		for (const [code, emoji] of Object.entries(emojiReplacements)) {
			const regex = new RegExp(code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
			result = result.replace(regex, emoji);
		}
		
		return result;
	}

	function cleanTitle(title: string): { cleanTitle: string; frameworks: string[] } {
		let cleanTitle = title;
		const frameworks: string[] = [];

		// Remove [FREE] or [PAID] tags (case insensitive)
		cleanTitle = cleanTitle.replace(/\[(free|paid|Free|FREE|Paid|PAID|ESCROW|Escrow|escrow)\]/g, '');

		// Remove all | pipes
		cleanTitle = cleanTitle.replace(/\|/g, '');

		// Replace Discourse text emojis with actual emojis
		cleanTitle = replaceDiscourseEmojis(cleanTitle);

		// make sure first letter of every word is capitalized
		cleanTitle = cleanTitle.replace(/\b\w/g, char => char.toUpperCase());

		// Extract framework compatibility tags
		const frameworkRegex = /\[([^\]]*(?:QB|ESX|QBCORE|QBCore|STANDALONE|QBox|OX|VRPEX|VORP|RSG|RedM|FXServer)[^\]]*)\]/gi;
		let match;
		while ((match = frameworkRegex.exec(cleanTitle)) !== null) {
			const frameworkText = match[1].trim();
			if (frameworkText) {
				// Parse multiple frameworks separated by /, &, or ,
				const parsedFrameworks = frameworkText
					.split(/[\/&,\+]/)
					.map(f => f.trim())
					.filter(f => f.length > 0)
					.map(f => {
						// Normalize common framework names
						const normalized = f.toUpperCase();
						if (normalized.includes('QBOX')) return 'QBox';
						if (normalized.includes('QB') || normalized.includes('QBCORE')) return 'QB';
						if (normalized.includes('ESX')) return 'ESX';
						if (normalized.includes('STANDALONE')) return 'Standalone';
						if (normalized.includes('OX')) return 'OX';
						if (normalized.includes('VRPEX')) return 'VRPEX';
						if (normalized.includes('VORP')) return 'VORP';
						if (normalized.includes('RSG')) return 'RSG';
						if (normalized.includes('REDM')) return 'RedM';
						if (normalized.includes('FXSERVER')) return 'FXServer';
						return f;
					});
				frameworks.push(...parsedFrameworks);
			}
		}

		// Remove framework tags from title
		cleanTitle = cleanTitle.replace(frameworkRegex, '');

		// Clean up extra whitespace and multiple spaces
		cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();

		// Remove duplicate frameworks
		const uniqueFrameworks = [...new Set(frameworks)];

		return { cleanTitle, frameworks: uniqueFrameworks };
	}
	
	function handleImageLoad(event: Event) {
		const img = event.target as HTMLImageElement;
		
		// Only handle blurry background for small images, don't set card widths
		if (cardElement && img.naturalWidth) {
			const minWidth = 300; // Threshold for small images
			const imageWidth = img.naturalWidth;
			
			if (imageWidth < minWidth) {
				// For small images, add blurry background but don't change card width
				const imageContainer = cardElement.querySelector('.topic-image') as HTMLElement;
				if (imageContainer) {
					imageContainer.style.backgroundImage = `url(${img.src})`;
					imageContainer.style.backgroundSize = 'cover';
					imageContainer.style.backgroundPosition = 'center';
					imageContainer.style.backgroundRepeat = 'no-repeat';
					imageContainer.classList.add('has-blur-background');
				}
			}
		}
	}
	
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		img.style.display = 'none';
		const parent = img.closest('.topic-image');
		if (parent) {
			parent.classList.add('no-image');
		}
		
		// Remove any fixed widths to let CSS Grid handle sizing
		setNoImageMaxWidth();
	}
	
	function setNoImageMaxWidth() {
		// Let CSS Grid handle sizing - don't set fixed widths
		if (cardElement) {
			cardElement.style.removeProperty('maxWidth');
			cardElement.style.removeProperty('minWidth');
		}
	}
	
	// Handle the case where there's no image from the start
	$: if (!topic.image_url && cardElement) {
		setNoImageMaxWidth();
	}
	
	async function openModal() {
		showModal = true;
		
		// Only fetch preview if we don't have it already
		if (previewContent === null && !loadingPreview) {
			await fetchPreview();
		}
	}
	
	function closeModal() {
		showModal = false;
	}
	
	async function fetchPreview() {
		loadingPreview = true;
		previewError = false;
		
		try {
			const response = await fetch(`/api/topic/${topic.id}/preview?slug=${encodeURIComponent(topic.slug)}`);
			const data = await response.json();
			
			if (response.ok) {
				previewContent = data.preview || '';
				youtubeLinks = data.youtubeLinks || [];
				tebexLinks = data.tebexLinks || [];
			} else {
				previewError = true;
				console.error('Failed to fetch preview:', data.error);
			}
		} catch (error) {
			previewError = true;
			console.error('Error fetching preview:', error);
		} finally {
			loadingPreview = false;
		}
	}
</script>

<article class="card h-100 topic-card {getResourceTypeClass(topic.tags)}" bind:this={cardElement}>
	{#if topic.image_url}
		<div class="topic-image clickable-image" on:click={openModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openModal()}>
			<img 
				src={topic.image_url} 
				alt={topic.title} 
				loading="lazy" 
				class="card-img-top"
				on:load={handleImageLoad}
				on:error={handleImageError}
			/>
		</div>
	{:else}
		<div class="topic-image no-image d-flex align-items-center justify-content-center clickable-image" on:click={openModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openModal()}>
			<div class="placeholder text-center text-white">
				<span class="icon d-block mb-2" style="font-size: 3rem;">🎮</span>
				<span class="text fw-semibold">FiveM Release</span>
			</div>
		</div>
	{/if}
	
	<div class="card-body topic-content">
		<h2 class="card-title topic-title">
			<button class="btn btn-link title-button p-0 text-start text-decoration-none" on:click={openModal}>
				{titleInfo.cleanTitle}
			</button>
		</h2>
		
		{#if titleInfo.frameworks.length > 0}
			<div class="framework-badges mb-2">
				{#each titleInfo.frameworks as framework}
					<span class="badge framework-badge">{framework}</span>
				{/each}
			</div>
		{/if}
		
		<div class="topic-meta">
			<div class="topic-info d-flex align-items-center gap-3 mb-3 small text-muted">
				{#if topic.author}
					<div class="author d-flex align-items-center">
						<img 
							src={getAvatarUrl(topic.author.avatar_template, 24)} 
							alt={topic.author.username}
							class="avatar rounded-circle me-2"
							width="24" height="24"
						/>
						<span class="username">by {topic.author.username}</span>
					</div>
				{/if}
				
				<span class="d-flex align-items-center gap-1">
					<span>📅</span> {topic.timeAgo}
				</span>
				<span class="d-flex align-items-center gap-1">
					<span>👁️</span> {formatNumber(topic.views)}
				</span>
				<span class="d-flex align-items-center gap-1">
					<span>❤️</span> {topic.like_count}
				</span>
				<span class="d-flex align-items-center gap-1">
					<span>💬</span> {topic.posts_count}
				</span>
			</div>
		</div>
		
		{#if topic.tags.length > 0}
			<div class="tags d-flex flex-wrap gap-1">
				{#each topic.tags.slice(0, 5) as tag}
					<span class="badge text-bg-light tag">{tag}</span>
				{/each}
				{#if topic.tags.length > 5}
					<span class="badge text-bg-primary tag-more">+{topic.tags.length - 5} more</span>
				{/if}
			</div>
		{/if}
	</div>
</article>

<Modal isOpen={showModal} title={titleInfo.cleanTitle} on:close={closeModal}>
	<div class="modal-preview-content d-flex flex-column gap-3">
		{#if youtubeLinks.length > 0}
			{@const videoId = getYouTubeVideoId(youtubeLinks[0])}
			{#if videoId}
				<div class="modal-youtube-embed">
					<div class="ratio ratio-16x9">
						<iframe 
							src="https://www.youtube.com/embed/{videoId}?hd=1&rel=0&modestbranding=1" 
							title="YouTube video player" 
							frameborder="0" 
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
							allowfullscreen
							class="rounded"
						></iframe>
					</div>
				</div>
			{:else if topic.image_url}
				<div class="modal-image">
					<img src={topic.image_url} alt={topic.title} class="img-fluid rounded" />
				</div>
			{/if}
		{:else if topic.image_url}
			<div class="modal-image">
				<img src={topic.image_url} alt={topic.title} class="img-fluid rounded" />
			</div>
		{/if}
		
		{#if titleInfo.frameworks.length > 0}
			<div class="framework-badges mb-3">
				{#each titleInfo.frameworks as framework}
					<span class="badge framework-badge">{framework}</span>
				{/each}
			</div>
		{/if}
		
		<div class="modal-meta">
			<div class="modal-info d-flex align-items-center gap-3 mb-3 small text-muted">
				{#if topic.author}
					<div class="modal-author d-flex align-items-center">
						<img 
							src={getAvatarUrl(topic.author.avatar_template, 24)} 
							alt={topic.author.username}
							class="modal-avatar rounded-circle me-2"
							width="24" height="24"
						/>
						<span class="modal-username">by {topic.author.username}</span>
					</div>
				{/if}
				
				<span>📅 {topic.timeAgo}</span>
				<span>👁️ {formatNumber(topic.views)}</span>
				<span>❤️ {topic.like_count}</span>
				<span>💬 {topic.posts_count}</span>
			</div>
		</div>
		
		{#if topic.tags.length > 0}
			<div class="modal-tags d-flex flex-wrap gap-1">
				{#each topic.tags as tag}
					<span class="badge text-bg-light">{tag}</span>
				{/each}
			</div>
		{/if}
		

		
		<!-- Action Links Section -->
		<div class="modal-actions-section">
			{#if tebexLinks.length > 0}
				<!-- Side by side layout when both buttons exist -->
				<div class="action-links d-flex gap-3">
					{#each tebexLinks as link}
						<a href={link} target="_blank" rel="noopener noreferrer" class="action-button purchase-button flex-fill">
							<div class="action-icon">💰</div>
							<div class="action-content">
								<div class="action-title">Purchase Resource</div>
								<div class="action-subtitle">Buy now on Tebex</div>
							</div>
							<div class="action-arrow">→</div>
						</a>
					{/each}
					
					<a href={topic.url} target="_blank" rel="noopener noreferrer" class="action-button view-button flex-fill">
						<div class="action-icon">🔗</div>
						<div class="action-content">
							<div class="action-title">View Full Resource</div>
							<div class="action-subtitle">Open in FiveM forum</div>
						</div>
						<div class="action-arrow">→</div>
					</a>
				</div>
			{:else}
				<!-- Single button layout when only view button exists -->
				<div class="action-links d-flex flex-column gap-3">
					<a href={topic.url} target="_blank" rel="noopener noreferrer" class="action-button view-button">
						<div class="action-icon">🔗</div>
						<div class="action-content">
							<div class="action-title">View Full Resource</div>
							<div class="action-subtitle">Open in FiveM forum</div>
						</div>
						<div class="action-arrow">→</div>
					</a>
				</div>
			{/if}
		</div>
		
		<div class="modal-preview-section">
			{#if loadingPreview}
				<div class="alert alert-info d-flex align-items-center justify-content-center" role="alert">
					<div class="spinner-border spinner-border-sm me-2" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					<span>Loading preview...</span>
				</div>
			{:else if previewError}
				<div class="alert alert-danger text-center" role="alert">
					<p class="mb-2">❌ Failed to load preview</p>
					<button on:click={fetchPreview} class="btn btn-danger btn-sm">🔄 Retry</button>
				</div>
			{:else if previewContent}
				<div class="alert alert-light border-start border-primary border-4 modal-preview-text preview-container">
					<div class="preview-content">{@html previewContent}</div>
				</div>
			{:else}
				<div class="alert alert-secondary text-center" role="alert">
					<p class="mb-0">📄 No preview content available</p>
				</div>
			{/if}
		</div>
	</div>
</Modal>

<style>
	.topic-card {
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 100%;
		min-width: 0;
	}
	
	.topic-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}
	
	/* Resource type styling */
	.resource-paid {
		background: linear-gradient(135deg, #f8f4ff 0%, #f0e6ff 100%);
	}
	
	.resource-free {
		background: linear-gradient(135deg, #f0fdf4 0%, #e8f8ed 100%);
	}
	
	/* Dark mode support for resource types */
	:global([data-bs-theme="dark"]) .resource-paid {
		background: linear-gradient(135deg, #2a1f3d 0%, #3c2764 100%);
	}
	
	:global([data-bs-theme="dark"]) .resource-free {
		background: linear-gradient(135deg, #1a2e23 0%, #234a2d 100%);
	}
	
	.topic-image {
		width: 100%;
		max-height: 400px;
		overflow: hidden;
		position: relative;
	}
	
	.clickable-image {
		cursor: pointer;
		transition: opacity 0.2s ease;
	}
	
	.clickable-image:hover {
		opacity: 0.9;
	}
	
	.clickable-image:focus {
		outline: 2px solid var(--bs-primary);
		outline-offset: 2px;
	}
	
	/* Topic info responsive layout */
	.topic-info {
		flex-wrap: wrap;
	}
	
	.topic-info .author {
		flex-shrink: 0;
	}
	
	/* Stack items on smaller screens */
	@media (max-width: 480px) {
		.topic-info {
			flex-direction: column;
			align-items: flex-start !important;
			gap: 0.5rem !important;
		}
		
		.topic-info .author {
			margin-bottom: 0.25rem;
		}
	}
	
	/* Modal info responsive layout */
	.modal-info {
		flex-wrap: wrap;
	}
	
	.modal-info .modal-author {
		flex-shrink: 0;
	}
	
	/* Stack modal items on smaller screens */
	@media (max-width: 480px) {
		.modal-info {
			flex-direction: column;
			align-items: flex-start !important;
			gap: 0.5rem !important;
		}
		
		.modal-info .modal-author {
			margin-bottom: 0.25rem;
		}
	}
	
	.topic-image img {
		width: 100%;
		height: auto;
		max-height: 400px;
		object-fit: cover;
		display: block;
		transition: transform 0.2s ease;
		position: relative;
		z-index: 2;
	}
	
	.topic-image.no-image {
		height: 200px;
	}
	
	/* Blurry background for small images */
	.topic-image.has-blur-background::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: inherit;
		filter: blur(15px) brightness(0.7);
		transform: scale(1.1);
		z-index: 1;
	}
	
	.topic-image.has-blur-background {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		max-height: 300px;
	}
	
	.topic-image.has-blur-background img {
		max-width: none;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
	
	.topic-card:hover .topic-image img {
		transform: scale(1.05);
	}
	
	.topic-image.no-image {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.title-button {
		color: var(--bs-body-color) !important;
		font-weight: 600 !important;
		line-height: 1.3;
	}
	
	.title-button:hover {
		color: #667eea !important;
	}
	
	.avatar {
		border: 2px solid var(--bs-border-color);
	}
	
	/* Framework badges */
	.framework-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	
	.framework-badge {
		background-color: var(--bs-primary);
		color: white;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
	}
	
	/* Modal content styles */
	.modal-image {
		max-height: 300px;
		overflow: hidden;
	}
	
	.modal-youtube-embed {
		max-width: 100%;
	}
	
	.modal-youtube-embed .ratio {
		max-height: 400px;
	}
	
	.modal-avatar {
		border: 2px solid var(--bs-border-color);
	}
	
	.modal-preview-text {
		line-height: 1.6;
	}
	
	/* Preview content formatting */
	.preview-content {
		font-size: 0.95rem;
		line-height: 1.6;
	}
	
	.preview-content p {
		margin-bottom: 1rem;
	}
	
	.preview-content p:last-child {
		margin-bottom: 0;
	}
	
	.preview-content strong,
	.preview-content b {
		font-weight: 600;
		color: var(--bs-emphasis-color);
	}
	
	.preview-content em,
	.preview-content i {
		font-style: italic;
		color: var(--bs-emphasis-color);
	}
	
	.preview-content ul,
	.preview-content ol {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
	
	.preview-content li {
		margin-bottom: 0.25rem;
	}
	
	.preview-content h1,
	.preview-content h2,
	.preview-content h3,
	.preview-content h4,
	.preview-content h5,
	.preview-content h6 {
		font-weight: 600;
		color: var(--bs-emphasis-color);
		margin: 1rem 0 0.5rem 0;
		line-height: 1.3;
	}
	
	.preview-content h1 { font-size: 1.4rem; }
	.preview-content h2 { font-size: 1.3rem; }
	.preview-content h3 { font-size: 1.2rem; }
	.preview-content h4 { font-size: 1.1rem; }
	.preview-content h5 { font-size: 1.05rem; }
	.preview-content h6 { font-size: 1rem; }
	
	.preview-content .forum-quote,
	.preview-content blockquote {
		background-color: var(--bs-light);
		border-left: 4px solid var(--bs-primary);
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		border-radius: 0.25rem;
		font-style: italic;
		color: var(--bs-secondary);
	}
	
	.preview-content .code-block,
	.preview-content pre {
		background-color: var(--bs-dark);
		color: var(--bs-light);
		padding: 1rem;
		border-radius: 0.375rem;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.875rem;
		overflow-x: auto;
		margin: 1rem 0;
	}
	
	.preview-content .inline-code,
	.preview-content code {
		background-color: var(--bs-light);
		color: var(--bs-dark);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.875rem;
	}
	
	.action-button {
		display: flex;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, var(--bs-light) 0%, var(--bs-gray-100) 100%);
		border: 1px solid var(--bs-border-color);
		border-radius: 0.75rem;
		text-decoration: none;
		color: var(--bs-body-color);
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
	}
	
	.action-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
		text-decoration: none;
		color: var(--bs-body-color);
	}
	
	.action-button:before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}
	
	.action-button:hover:before {
		left: 100%;
	}
	
	.purchase-button {
		background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
		border-color: #28a745;
	}
	
	.purchase-button:hover {
		background: linear-gradient(135deg, #c3e6cb 0%, #b6dfbb 100%);
		color: var(--bs-body-color);
	}
	
	.view-button {
		background: linear-gradient(135deg, #cce7ff 0%, #b3d9ff 100%);
		border-color: #007bff;
	}
	
	.view-button:hover {
		background: linear-gradient(135deg, #b3d9ff 0%, #99ccff 100%);
		color: var(--bs-body-color);
	}
	
	.action-icon {
		font-size: 1.5rem;
		margin-right: 1rem;
		min-width: 40px;
		text-align: center;
	}
	
	.action-content {
		flex: 1;
	}
	
	.action-title {
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}
	
	.action-subtitle {
		font-size: 0.875rem;
		color: var(--bs-secondary);
		opacity: 0.8;
	}
	
	.action-arrow {
		font-size: 1.25rem;
		opacity: 0.6;
		transition: all 0.2s ease;
		margin-left: 1rem;
	}
	
	.action-button:hover .action-arrow {
		opacity: 1;
		transform: translateX(4px);
	}
	
	/* Responsive design for side-by-side buttons */
	@media (max-width: 576px) {
		.action-links.d-flex:not(.flex-column) {
			flex-direction: column !important;
		}
		
		.action-links.d-flex:not(.flex-column) .action-button {
			flex: none !important;
		}
	}
	
	/* Dark mode support for action buttons */
	:global([data-bs-theme="dark"]) .action-button {
		background: linear-gradient(135deg, var(--bs-dark) 0%, #2c2c2c 100%);
		border-color: var(--bs-border-color);
		color: var(--bs-body-color);
	}
	
	:global([data-bs-theme="dark"]) .action-button:hover {
		color: var(--bs-body-color);
	}
	
	:global([data-bs-theme="dark"]) .purchase-button {
		background: linear-gradient(135deg, #1e4d2b 0%, #2d5a37 100%);
		border-color: #28a745;
	}
	
	:global([data-bs-theme="dark"]) .purchase-button:hover {
		background: linear-gradient(135deg, #2d5a37 0%, #3a6b44 100%);
		color: var(--bs-body-color);
	}
	
	:global([data-bs-theme="dark"]) .view-button {
		background: linear-gradient(135deg, #1e3a5f 0%, #2d4a73 100%);
		border-color: #007bff;
	}
	
	:global([data-bs-theme="dark"]) .view-button:hover {
		background: linear-gradient(135deg, #2d4a73 0%, #3a5987 100%);
		color: var(--bs-body-color);
	}
	
	/* Dark mode support for preview container */
	:global([data-bs-theme="dark"]) .preview-container {
		background-color: var(--bs-dark) !important;
		color: var(--bs-body-color) !important;
	}
	
	/* Dark mode support for forum quotes */
	:global([data-bs-theme="dark"]) .preview-content .forum-quote,
	:global([data-bs-theme="dark"]) .preview-content blockquote {
		background-color: var(--bs-dark);
		color: var(--bs-body-color);
	}
	
	/* Dark mode support for code blocks */
	:global([data-bs-theme="dark"]) .preview-content .code-block,
	:global([data-bs-theme="dark"]) .preview-content pre {
		background-color: #1a1a1a;
		color: var(--bs-light);
	}
	
	/* Dark mode support for inline code */
	:global([data-bs-theme="dark"]) .preview-content .inline-code,
	:global([data-bs-theme="dark"]) .preview-content code {
		background-color: var(--bs-dark);
		color: var(--bs-light);
	}
</style> 