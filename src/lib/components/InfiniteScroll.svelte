<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { ProcessedTopic } from '$lib/types';

	export let currentFilter: string = 'latest';
	export let isLoading: boolean = false;
	export let hasMorePages: boolean = true;
	export let currentPage: number = 1;

	const dispatch = createEventDispatcher();

	let scrollContainer: HTMLElement;
	let loadingElement: HTMLElement;
	let intersectionObserver: IntersectionObserver;

	onMount(() => {
		// Create intersection observer to detect when loading element comes into view
		intersectionObserver = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && hasMorePages && !isLoading) {
					console.log('📜 Loading more topics...');
					loadMoreTopics();
				}
			},
			{
				root: null, // Use the viewport as root
				rootMargin: '100px', // Trigger 100px before the element is visible
				threshold: 0.1
			}
		);

		// Start observing the loading element
		if (loadingElement) {
			intersectionObserver.observe(loadingElement);
		}
	});

	onDestroy(() => {
		if (intersectionObserver) {
			intersectionObserver.disconnect();
		}
	});

	async function loadMoreTopics() {
		if (isLoading || !hasMorePages) return;

		// Dispatch loading start event
		dispatch('loadingStart');

		try {
			const nextPage = currentPage + 1;
			const response = await fetch(`/api/topics?filter=${currentFilter}&page=${nextPage}`);

			if (!response.ok) {
				throw new Error('Failed to fetch more topics');
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			// Dispatch event with new topics data
			dispatch('loadMore', {
				topics: data.topics,
				currentPage: data.currentPage,
				hasMorePages: data.hasMorePages,
				totalTopics: data.totalTopics
			});
		} catch (error) {
			console.error('Error loading more topics:', error);
			dispatch('error', error);
		}
	}

	// Re-observe the loading element when hasMorePages or isLoading changes
	$: if (intersectionObserver && loadingElement) {
		intersectionObserver.disconnect();
		if (hasMorePages && !isLoading) {
			intersectionObserver.observe(loadingElement);
		}
	}
</script>

{#if hasMorePages}
	<div bind:this={loadingElement} class="infinite-scroll-trigger" class:loading={isLoading}>
		{#if isLoading}
			<div class="loading-content">
				<div class="spinner-border text-primary" role="status">
					<span class="visually-hidden">Loading more topics...</span>
				</div>
				<p class="loading-text">Loading more releases...</p>
			</div>
		{:else}
			<div class="load-more-prompt">
				<button class="btn btn-outline-primary load-more-button" on:click={loadMoreTopics}>
					<span class="load-more-icon">⬇️</span>
					<span class="load-more-text">Load More Releases</span>
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="end-of-content">
		<div class="end-message">
			<span class="end-icon">🎯</span>
			<p class="end-text">You've reached the end of the releases!</p>
			<p class="end-subtext">Check back later for new content</p>
		</div>
	</div>
{/if}

<style>
	.infinite-scroll-trigger {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		min-height: 100px;
		transition: all 0.3s ease;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.loading-text {
		margin: 0;
		color: var(--bs-text-muted);
		font-size: 0.95rem;
		font-weight: 500;
	}

	.load-more-prompt {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.load-more-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 2rem;
		transition: all 0.3s ease;
		border: 2px solid var(--bs-primary);
		background: transparent;
	}

	.load-more-button:hover {
		background: var(--bs-primary);
		color: white;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
	}

	.load-more-icon {
		font-size: 1.1rem;
		transition: transform 0.3s ease;
	}

	.load-more-button:hover .load-more-icon {
		transform: translateY(2px);
	}

	.load-more-text {
		font-size: 0.95rem;
	}

	.end-of-content {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 3rem 1rem;
		margin-top: 2rem;
	}

	.end-message {
		text-align: center;
		color: var(--bs-text-muted);
		max-width: 300px;
	}

	.end-icon {
		font-size: 2.5rem;
		display: block;
		margin-bottom: 1rem;
	}

	.end-text {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--bs-body-color);
	}

	.end-subtext {
		font-size: 0.9rem;
		margin: 0;
		color: var(--bs-text-muted);
	}

	/* Loading animation */
	.infinite-scroll-trigger.loading {
		background: linear-gradient(90deg, transparent, rgba(13, 110, 253, 0.05), transparent);
		background-size: 200% 100%;
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.infinite-scroll-trigger {
			padding: 1.5rem 1rem;
			min-height: 80px;
		}

		.load-more-button {
			padding: 0.6rem 1.2rem;
			gap: 0.5rem;
		}

		.load-more-text,
		.loading-text {
			font-size: 0.9rem;
		}

		.end-of-content {
			padding: 2rem 1rem;
		}

		.end-icon {
			font-size: 2rem;
		}

		.end-text {
			font-size: 1rem;
		}

		.end-subtext {
			font-size: 0.85rem;
		}
	}
</style>
