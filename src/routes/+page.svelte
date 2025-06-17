<script lang="ts">
	import type { PageData } from './$types';
	import TopicCard from '$lib/components/TopicCard.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import SettingsToggle from '$lib/components/SettingsToggle.svelte';
	import ViewControls from '$lib/components/ViewControls.svelte';
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import ScrollStatus from '$lib/components/ScrollStatus.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import type { ProcessedTopic } from '$lib/types';
	
	export let data: PageData;
	
	let showSettings = false;
	let isFilterLoading = false;
	let isInfiniteLoading = false;
	
	// Initialize topics state with server data
	let allTopics: ProcessedTopic[] = data.topics || [];
	let currentPage = data.currentPage || 1;
	let hasMorePages = data.hasMorePages || false;
	
	// Grid layout state with localStorage persistence
	let gridColumns = 3; // Default value
	let resourceTypeFilter = 'all'; // Default to show all resources
	
	// Load preferences from localStorage on client
	if (browser) {
		const savedColumns = localStorage.getItem('gridColumns');
		if (savedColumns) {
			const parsedColumns = parseInt(savedColumns, 10) || 3;
			// Only allow 3 or 4 columns, default to 3 for invalid values
			gridColumns = (parsedColumns === 3 || parsedColumns === 4) ? parsedColumns : 3;
		}
		
		const savedResourceFilter = localStorage.getItem('resourceTypeFilter');
		if (savedResourceFilter) {
			resourceTypeFilter = savedResourceFilter;
		}
	}
	
	// Update state when data changes (e.g., filter change)
	$: {
		allTopics = data.topics || [];
		currentPage = data.currentPage || 1;
		hasMorePages = data.hasMorePages || false;
	}
	
	function openSettings() {
		showSettings = true;
	}
	
	function closeSettings() {
		showSettings = false;
	}
	
	async function handleFilterChange(event: CustomEvent<string>) {
		const newFilter = event.detail;
		isFilterLoading = true;
		
		try {
			// Update URL with new filter parameter
			const url = new URL($page.url);
			if (newFilter === 'latest') {
				url.searchParams.delete('filter');
			} else {
				url.searchParams.set('filter', newFilter);
			}
			
			// Navigate to new URL which will trigger server load
			await goto(url.toString(), { 
				invalidateAll: true,
				noScroll: true 
			});
		} finally {
			isFilterLoading = false;
		}
	}
	
	function handleGridChange(event: CustomEvent<number>) {
		const newColumns = event.detail;
		gridColumns = newColumns;
		
		// Save to localStorage
		if (browser) {
			localStorage.setItem('gridColumns', newColumns.toString());
		}
	}

	function handleResourceTypeChange(event: CustomEvent<string>) {
		const newType = event.detail;
		resourceTypeFilter = newType;
		
		// Save to localStorage
		if (browser) {
			localStorage.setItem('resourceTypeFilter', newType);
		}
	}
	
	function handleLoadMore(event: CustomEvent) {
		const { topics, currentPage: newPage, hasMorePages: morePages } = event.detail;
		
		// Append new topics to existing array
		allTopics = [...allTopics, ...topics];
		currentPage = newPage;
		hasMorePages = morePages;
		isInfiniteLoading = false;
		
		console.log(`✅ Loaded page ${newPage}, now showing ${allTopics.length} topics total`);
	}
	
	function handleInfiniteScrollError(event: CustomEvent) {
		console.error('Infinite scroll error:', event.detail);
		isInfiniteLoading = false;
	}
	
	// Set loading state when infinite scroll starts
	function handleInfiniteScrollStart() {
		isInfiniteLoading = true;
	}
	
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

	function getResourceType(tags: string[]): 'paid' | 'free' | 'unknown' {
		const lowerTags = tags.map(tag => tag.toLowerCase());
		if (lowerTags.includes('paid')) {
			return 'paid';
		} else if (lowerTags.includes('free')) {
			return 'free';
		}
		return 'unknown';
	}

	// Create a reactive statement to filter topics based on resource type
	$: filteredTopics = resourceTypeFilter === 'all' 
		? allTopics 
		: allTopics.filter(topic => {
			const resourceType = getResourceType(topic.tags);
			return resourceTypeFilter === resourceType;
		});
</script>

<svelte:head>
	<title>FiveM Releases Viewer</title>
	<meta name="description" content="Browse the latest FiveM releases from the CFX community forum" />
</svelte:head>
<PageHeader />
<div class="container-fluid px-3 px-md-4">

	<!-- View Controls (Sort + Grid Layout + Resource Type) -->
	<ViewControls 
		currentFilter={data.currentFilter || 'latest'} 
		isLoading={isFilterLoading}
		{gridColumns}
		{resourceTypeFilter}
		on:filterChange={handleFilterChange}
		on:gridChange={handleGridChange}
		on:resourceTypeChange={handleResourceTypeChange}
	/>

	{#if data.error}
		<div class="alert alert-danger text-center" role="alert">
			<p class="mb-0">❌ {data.error}</p>
		</div>
	{:else if allTopics.length === 0}
		<div class="d-flex justify-content-center align-items-center py-5">
			<div class="text-center">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-3 text-muted">Loading releases...</p>
			</div>
		</div>
	{:else if filteredTopics.length === 0}
		<div class="d-flex justify-content-center align-items-center py-5">
			<div class="text-center">
				<div class="mb-3">
					{#if resourceTypeFilter === 'paid'}
						<span style="font-size: 3rem;">💰</span>
					{:else if resourceTypeFilter === 'free'}
						<span style="font-size: 3rem;">🆓</span>
					{/if}
				</div>
				<h4 class="text-muted">No {resourceTypeFilter} resources found</h4>
				<p class="text-muted">Try changing your filter or check back later</p>
			</div>
		</div>
	{:else}
		<div class="topics-grid" style="--grid-columns: {gridColumns}">
			{#each filteredTopics as topic}
				<TopicCard {topic} />
			{/each}
		</div>
		
		<!-- Infinite Scroll Component -->
		<InfiniteScroll 
			currentFilter={data.currentFilter || 'latest'}
			isLoading={isInfiniteLoading}
			{hasMorePages}
			{currentPage}
			on:loadingStart={handleInfiniteScrollStart}
			on:loadMore={handleLoadMore}
			on:error={handleInfiniteScrollError}
		/>
	{/if}
</div>

<!-- Settings and Theme Toggles positioned in bottom right -->
<SettingsToggle onClick={openSettings} />
<ThemeToggle />

<!-- Settings Modal -->
<SettingsModal isOpen={showSettings} on:close={closeSettings} />

<!-- Debug: Scroll Status Indicator -->
<ScrollStatus 
	{currentPage}
	{hasMorePages}
	totalTopics={filteredTopics.length}
	isLoading={isInfiniteLoading}
/>

<style>
	.topics-grid {
		display: grid;
		gap: 1.5rem;
		max-width: calc(100% - 4rem);
		margin: 0 auto;
		padding: 0 1rem;
		grid-template-columns: repeat(var(--grid-columns, 3), minmax(0, 1fr));
		justify-items: stretch;
		align-items: start;
	}

	/* Extra large screens (1400px+) - More side margins for very wide screens */
	@media (min-width: 1400px) {
		.topics-grid {
			max-width: calc(100% - 6rem);
		}
	}

	/* Very large screens (1920px+) - Even more margins for ultra-wide screens */
	@media (min-width: 1920px) {
		.topics-grid {
			max-width: calc(100% - 8rem);
		}
	}

	@media (min-width: 2400px) {
		.topics-grid {
			max-width: calc(100% - 20rem);
		}
	}

	/* Large screens (992px - 1199px) - Reduce to 3 columns max */
	@media (max-width: 1199px) {
		.topics-grid {
			grid-template-columns: repeat(min(var(--grid-columns, 3), 3), minmax(0, 1fr));
			max-width: calc(100% - 3rem);
		}
	}
	
	/* Medium screens (768px - 991px) - Force 2 columns */
	@media (max-width: 991px) {
		.topics-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			max-width: calc(100% - 2rem);
		}
	}
	
	/* Small screens (up to 767px) - Single column */
	@media (max-width: 767px) {
		.topics-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
			max-width: calc(100% - 1rem);
		}
	}
	
	/* Ensure consistent card heights in each row */
	.topics-grid :global(.topic-card) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.topics-grid :global(.card-body) {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
