<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let isOpen = false;

	const dispatch = createEventDispatcher();

	const fonts = [
		{ name: 'Poppins', value: 'Poppins', preview: 'The quick brown fox jumps over the lazy dog' },
		{ name: 'Inter', value: 'Inter', preview: 'Clean and modern typeface for interfaces' },
		{ name: 'Roboto', value: 'Roboto', preview: "Google's signature font family" },
		{ name: 'Open Sans', value: 'Open Sans', preview: 'Friendly and open curves' },
		{ name: 'System Default', value: 'system', preview: "Your operating system's default font" }
	];

	let selectedFont = 'Poppins';

	onMount(() => {
		// Load saved font from localStorage
		const savedFont = localStorage.getItem('selectedFont');
		if (savedFont) {
			selectedFont = savedFont;
			applyFont(selectedFont);
		}
	});

	function applyFont(fontValue: string) {
		const body = document.body;

		if (fontValue === 'system') {
			body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		} else {
			body.style.fontFamily = `'${fontValue}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
		}
	}

	function handleFontChange(fontValue: string) {
		selectedFont = fontValue;
		applyFont(fontValue);
		localStorage.setItem('selectedFont', fontValue);
	}

	function closeModal() {
		dispatch('close');
	}

	function resetSettings() {
		selectedFont = 'Poppins';
		applyFont('Poppins');
		localStorage.setItem('selectedFont', 'Poppins');
	}
</script>

<Modal {isOpen} title="Settings" on:close={closeModal}>
	<div class="settings-content">
		<!-- Font Settings Section -->
		<div class="settings-section">
			<h3 class="section-title">
				<span class="section-icon">🔤</span>
				Font Family
			</h3>
			<p class="section-description">Choose your preferred font for the entire application</p>

			<div class="font-options">
				{#each fonts as font}
					<label class="font-option" class:selected={selectedFont === font.value}>
						<input
							type="radio"
							name="font"
							value={font.value}
							checked={selectedFont === font.value}
							on:change={() => handleFontChange(font.value)}
							class="visually-hidden"
						/>
						<div class="font-option-content">
							<div class="font-name">{font.name}</div>
							<div
								class="font-preview"
								style="font-family: {font.value === 'system'
									? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
									: `'${font.value}', sans-serif`}"
							>
								{font.preview}
							</div>
						</div>
						<div class="font-check">
							{#if selectedFont === font.value}
								<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
									<path
										d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
									/>
								</svg>
							{/if}
						</div>
					</label>
				{/each}
			</div>
		</div>

		<!-- Reset Section -->
		<div class="settings-section">
			<h3 class="section-title">
				<span class="section-icon">🔄</span>
				Reset Settings
			</h3>
			<p class="section-description">Restore all settings to their default values</p>

			<button class="btn btn-outline-danger" on:click={resetSettings}>
				<svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" class="me-2">
					<path
						fill-rule="evenodd"
						d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
					/>
					<path
						d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
					/>
				</svg>
				Reset to Defaults
			</button>
		</div>

		<!-- Info Section -->
		<div class="settings-section">
			<div class="settings-info">
				<div class="info-item">
					<span class="info-icon">💾</span>
					<span class="info-text">Settings are automatically saved to your browser</span>
				</div>
				<div class="info-item">
					<span class="info-icon">🔄</span>
					<span class="info-text">Changes apply immediately across the entire app</span>
				</div>
			</div>
		</div>
	</div>
</Modal>

<style>
	.settings-content {
		max-width: 100%;
	}

	.settings-section {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--bs-border-color);
	}

	.settings-section:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: var(--bs-body-color);
	}

	.section-icon {
		font-size: 1.2rem;
	}

	.section-description {
		margin: 0 0 1rem 0;
		color: var(--bs-secondary-color);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.font-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.font-option {
		display: flex;
		align-items: center;
		padding: 1rem;
		border: 2px solid var(--bs-border-color);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		background: var(--bs-body-bg);
	}

	.font-option:hover {
		border-color: var(--bs-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.font-option.selected {
		border-color: var(--bs-primary);
		background: rgba(13, 110, 253, 0.1);
	}

	.font-option-content {
		flex: 1;
	}

	.font-name {
		font-weight: 600;
		margin-bottom: 0.25rem;
		color: var(--bs-body-color);
	}

	.font-preview {
		font-size: 0.85rem;
		color: var(--bs-secondary-color);
		line-height: 1.3;
	}

	.font-check {
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--bs-primary);
		margin-left: 1rem;
	}

	.settings-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--bs-secondary-bg);
		border-radius: 0.375rem;
	}

	.info-icon {
		font-size: 1rem;
	}

	.info-text {
		font-size: 0.85rem;
		color: var(--bs-secondary-color);
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.font-option {
			padding: 0.75rem;
		}

		.font-name {
			font-size: 0.9rem;
		}

		.font-preview {
			font-size: 0.8rem;
		}

		.section-title {
			font-size: 1rem;
		}

		.info-item {
			padding: 0.6rem;
		}

		.info-text {
			font-size: 0.8rem;
		}
	}
</style>
