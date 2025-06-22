<script lang="ts">
	export let currentPage: number = 1;
	export let hasMorePages: boolean = true;
	export let totalTopics: number = 0;
	export let isLoading: boolean = false;

	let isVisible = false;

	// Show status when scrolling
	let scrollTimeout: number;

	function handleScroll() {
		isVisible = true;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			isVisible = false;
		}, 2000);
	}

	// Listen for scroll events
	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', handleScroll);
	}
</script>

<div class="scroll-status" class:visible={isVisible || isLoading}>
	<div class="status-content">
		<div class="status-item">
			<span class="status-label">Page:</span>
			<span class="status-value">{currentPage}</span>
		</div>
		<div class="status-item">
			<span class="status-label">Topics:</span>
			<span class="status-value">{totalTopics}</span>
		</div>
		<div class="status-item">
			<span class="status-label">More:</span>
			<span class="status-value status-{hasMorePages ? 'yes' : 'no'}">
				{hasMorePages ? '✓' : '✗'}
			</span>
		</div>
		{#if isLoading}
			<div class="status-item">
				<span class="status-label">Loading...</span>
				<div class="spinner-border spinner-border-sm" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.scroll-status {
		position: fixed;
		top: 20px;
		right: 20px;
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-family: monospace;
		z-index: 1000;
		opacity: 0;
		transform: translateY(-10px);
		transition: all 0.3s ease;
		pointer-events: none;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.scroll-status.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.status-content {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.status-label {
		color: #ccc;
	}

	.status-value {
		font-weight: bold;
		color: white;
	}

	.status-yes {
		color: #4caf50;
	}

	.status-no {
		color: #f44336;
	}

	@media (max-width: 768px) {
		.scroll-status {
			top: 10px;
			right: 10px;
			font-size: 0.7rem;
			padding: 0.4rem 0.8rem;
		}

		.status-content {
			gap: 0.75rem;
		}

		.status-item {
			gap: 0.2rem;
		}
	}
</style>
