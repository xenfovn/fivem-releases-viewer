<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let title = '';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true">
		<div class="modal-content">
			<div class="modal-header">
				<h2 class="modal-title">{title}</h2>
				<button class="close-button" on:click={closeModal} aria-label="Close modal"> ✕ </button>
			</div>
			<div class="modal-body">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
		backdrop-filter: blur(2px);
	}

	.modal-content {
		background: var(--bs-body-bg);
		border-radius: 12px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
		max-width: 700px;
		width: 100%;
		max-height: 80vh;
		overflow: hidden;
		animation: modalSlideIn 0.3s ease-out;
		border: 1px solid var(--bs-border-color);
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid var(--bs-border-color);
		background: var(--bs-secondary-bg);
	}

	.modal-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--bs-body-color);
		line-height: 1.3;
		padding-right: 20px;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--bs-secondary-color);
		padding: 4px;
		border-radius: 4px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
	}

	.close-button:hover {
		background: var(--bs-secondary-bg);
		color: var(--bs-body-color);
	}

	.modal-body {
		padding: 24px;
		overflow-y: auto;
		max-height: calc(80vh - 80px);
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.modal-backdrop {
			padding: 10px;
		}

		.modal-content {
			max-height: 90vh;
		}

		.modal-header {
			padding: 16px 20px;
		}

		.modal-title {
			font-size: 1.1rem;
		}

		.modal-body {
			padding: 20px;
			max-height: calc(90vh - 70px);
		}
	}
</style>
