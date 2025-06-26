<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let currentFilter = 'latest';
	export let isLoading = false;
	export let gridColumns = 3; // Default to 3 columns
	export let resourceTypeFilter = 'all'; // 'all', 'paid', 'free'
	export let searchQuery = '';

	const dispatch = createEventDispatcher();

	const filterOptions = [
		{ value: 'latest', label: 'Latest', icon: '🕒' },
		{ value: 'hot', label: 'Hot', icon: '🔥' },
		{ value: 'top-weekly', label: 'Top Weekly', icon: '📅' },
		{ value: 'top-monthly', label: 'Top Monthly', icon: '📊' },
		{ value: 'top-quarterly', label: 'Top Quarterly', icon: '📈' },
		{ value: 'top-yearly', label: 'Top Yearly', icon: '🏆' },
		{ value: 'top-all', label: 'Top All Time', icon: '👑' }
	];

	const gridOptions = [
		{ value: 3, label: '3 Columns', icon: '│││' },
		{ value: 4, label: '4 Columns', icon: '││││' }
	];

	const resourceTypeOptions = [
		{ value: 'all', label: 'All Resources', icon: '🔧' },
		{ value: 'paid', label: 'Paid Only', icon: '💰' },
		{ value: 'free', label: 'Free Only', icon: '🆓' }
	];

	function handleFilterChange(newFilter: string) {
		if (newFilter !== currentFilter && !isLoading) {
			dispatch('filterChange', newFilter);
		}
	}

	function handleGridChange(newColumns: number) {
		if (newColumns !== gridColumns) {
			dispatch('gridChange', newColumns);
		}
	}

	function handleResourceTypeChange(newType: string) {
		if (newType !== resourceTypeFilter) {
			dispatch('resourceTypeChange', newType);
		}
	}

	function handleSearchChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newQuery = target.value;
		dispatch('searchChange', newQuery);
	}

	function getCurrentFilterLabel() {
		const option = filterOptions.find((opt) => opt.value === currentFilter);
		return option ? option.label : 'Latest';
	}

	function getCurrentFilterIcon() {
		const option = filterOptions.find((opt) => opt.value === currentFilter);
		return option ? option.icon : '🕒';
	}

	function getCurrentGridIcon() {
		const option = gridOptions.find((opt) => opt.value === gridColumns);
		return option ? option.icon : '│││';
	}

	function getCurrentResourceTypeLabel() {
		const option = resourceTypeOptions.find((opt) => opt.value === resourceTypeFilter);
		return option ? option.label : 'All Resources';
	}

	function getCurrentResourceTypeIcon() {
		const option = resourceTypeOptions.find((opt) => opt.value === resourceTypeFilter);
		return option ? option.icon : '🔧';
	}
</script>

<div class="view-controls">
	<div class="controls-container">
		<!-- Search Bar -->
		<div class="control-section search-section">
			<div class="control-label">
				<span class="control-icon">🔍</span>
				<span class="control-text">Search:</span>
			</div>

			<div class="search-input-container">
				<input
					type="text"
					class="form-control search-input"
					placeholder="Search... (or use name:, tag:, author:)"
					value={searchQuery}
					on:input={handleSearchChange}
				/>
				{#if searchQuery}
					<button
						class="btn btn-outline-secondary clear-search-btn"
						on:click={() => dispatch('searchChange', '')}
						type="button"
					>
						✕
					</button>
				{/if}
			</div>
		</div>

		<!-- Sort Filter -->
		<div class="control-section">
			<div class="control-label">
				<span class="control-icon">📋</span>
				<span class="control-text">Sort by:</span>
			</div>

			<div class="dropdown">
				<button
					class="btn btn-outline-primary dropdown-toggle control-button"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					disabled={isLoading}
				>
					<span class="current-icon">{getCurrentFilterIcon()}</span>
					<span class="current-text">{getCurrentFilterLabel()}</span>
					{#if isLoading}
						<div class="spinner-border spinner-border-sm ms-2" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					{/if}
				</button>

				<ul class="dropdown-menu">
					{#each filterOptions as option}
						<li>
							<button
								class="dropdown-item"
								class:active={currentFilter === option.value}
								on:click={() => handleFilterChange(option.value)}
							>
								<span class="dropdown-icon">{option.icon}</span>
								<span class="dropdown-text">{option.label}</span>
								{#if currentFilter === option.value}
									<span class="dropdown-check">
										<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
											<path
												d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
											/>
										</svg>
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Resource Type Filter -->
		<div class="control-section">
			<div class="control-label">
				<span class="control-icon">💎</span>
				<span class="control-text">Type:</span>
			</div>

			<div class="dropdown">
				<button
					class="btn btn-outline-success dropdown-toggle control-button"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					disabled={isLoading}
				>
					<span class="current-icon">{getCurrentResourceTypeIcon()}</span>
					<span class="current-text">{getCurrentResourceTypeLabel()}</span>
					{#if isLoading}
						<div class="spinner-border spinner-border-sm ms-2" role="status">
							<span class="visually-hidden">Loading...</span>
						</div>
					{/if}
				</button>

				<ul class="dropdown-menu">
					{#each resourceTypeOptions as option}
						<li>
							<button
								class="dropdown-item"
								class:active={resourceTypeFilter === option.value}
								on:click={() => handleResourceTypeChange(option.value)}
							>
								<span class="dropdown-icon">{option.icon}</span>
								<span class="dropdown-text">{option.label}</span>
								{#if resourceTypeFilter === option.value}
									<span class="dropdown-check">
										<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
											<path
												d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
											/>
										</svg>
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Grid Layout Control -->
		<div class="control-section">
			<div class="control-label">
				<span class="control-icon">🔄</span>
				<span class="control-text">Layout:</span>
			</div>

			<div class="dropdown">
				<button
					class="btn btn-outline-secondary dropdown-toggle control-button"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<span class="current-icon">{getCurrentGridIcon()}</span>
					<span class="current-text">{gridColumns} Column{gridColumns > 1 ? 's' : ''}</span>
				</button>

				<ul class="dropdown-menu">
					{#each gridOptions as option}
						<li>
							<button
								class="dropdown-item"
								class:active={gridColumns === option.value}
								on:click={() => handleGridChange(option.value)}
							>
								<span class="dropdown-icon">{option.icon}</span>
								<span class="dropdown-text">{option.label}</span>
								{#if gridColumns === option.value}
									<span class="dropdown-check">
										<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
											<path
												d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
											/>
										</svg>
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.view-controls {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
		padding: 0 1rem;
	}

	.controls-container {
		display: flex;
		align-items: center;
		gap: 3rem;
		padding: 1.25rem 2rem;
		background: var(--bs-body-bg);
		border: 1px solid var(--bs-border-color);
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		backdrop-filter: blur(10px);
		max-width: 100%;
		flex-wrap: wrap;
		position: relative;
		z-index: 10;
	}

	.control-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
	}

	.dropdown {
		position: relative;
		z-index: 99999;
	}

	.dropdown-menu {
		z-index: 99999;
	}

	.control-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--bs-body-color);
		white-space: nowrap;
		min-width: fit-content;
	}

	.control-icon {
		font-size: 1.1rem;
	}

	.control-text {
		font-size: 0.95rem;
	}

	.control-button {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 140px;
		justify-content: flex-start;
		padding: 0.6rem 1.2rem;
		border-radius: 0.6rem;
		transition: all 0.2s ease;
		font-weight: 500;
		border-width: 2px;
	}

	.control-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.current-icon {
		font-size: 1rem;
		font-family: monospace;
		letter-spacing: -2px;
	}

	.current-text {
		font-size: 0.9rem;
		font-weight: 500;
	}

	.dropdown-menu {
		min-width: 200px;
		padding: 0.5rem 0;
		border-radius: 0.6rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		border: 1px solid var(--bs-border-color);
		z-index: 1050;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		transition: all 0.2s ease;
		border: none;
		background: none;
		width: 100%;
		text-align: left;
	}

	.dropdown-item:hover {
		background: var(--bs-secondary-bg);
		color: var(--bs-body-color);
	}

	.dropdown-item.active {
		background: rgba(13, 110, 253, 0.1);
		color: var(--bs-primary);
		font-weight: 500;
	}

	.dropdown-icon {
		font-size: 1rem;
		width: 24px;
		text-align: center;
		font-family: monospace;
		letter-spacing: -2px;
	}

	.dropdown-text {
		flex: 1;
	}

	.dropdown-check {
		color: var(--bs-primary);
		margin-left: auto;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.view-controls {
			margin: 1.5rem 0;
		}

		.controls-container {
			flex-direction: column;
			gap: 1.5rem;
			padding: 1rem 1.5rem;
			border-radius: 0.8rem;
		}

		.control-section {
			width: 100%;
			justify-content: space-between;
		}

		.control-button {
			min-width: 120px;
			padding: 0.5rem 1rem;
			justify-content: center;
		}

		.dropdown-menu {
			min-width: 100%;
		}

		.control-text {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.controls-container {
			gap: 1rem;
			padding: 0.8rem 1rem;
		}

		.control-label {
			font-size: 0.85rem;
		}

		.control-button {
			min-width: 100px;
			padding: 0.4rem 0.8rem;
			font-size: 0.85rem;
		}

		.dropdown-item {
			padding: 0.6rem 0.8rem;
			font-size: 0.85rem;
		}
	}

	/* Enhanced visual effects */
	.controls-container {
		background: linear-gradient(
			135deg,
			var(--bs-body-bg) 0%,
			rgba(var(--bs-primary-rgb), 0.02) 100%
		);
		position: relative;
	}

	.controls-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.05) 100%
		);
		border-radius: inherit;
		pointer-events: none;
	}

	.control-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	/* Search input styles */
	.search-section {
		min-width: 280px;
	}

	.search-input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input {
		min-width: 220px;
		padding: 0.6rem 1rem;
		border-radius: 0.6rem;
		border: 2px solid var(--bs-border-color);
		transition: all 0.2s ease;
		font-size: 0.9rem;
		background: var(--bs-body-bg);
	}

	.search-input:focus {
		border-color: var(--bs-primary);
		box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
		outline: none;
	}

	.clear-search-btn {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.2rem 0.4rem;
		border: none;
		background: transparent;
		font-size: 0.8rem;
		line-height: 1;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.clear-search-btn:hover {
		background: var(--bs-secondary-bg);
	}

	@media (max-width: 768px) {
		.search-section {
			min-width: 100%;
			order: -1;
		}

		.search-input {
			min-width: 100%;
		}
	}
</style>
