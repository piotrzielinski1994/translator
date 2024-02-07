<script lang="ts">
	let fileToDownload: Blob | null = null;
	let isLoading = false;
	let errorMessage = '';

	async function handleSubmit(event) {
		event.preventDefault();
		isLoading = true;
		errorMessage = '';

		const formData = new FormData();
		formData.append('file', event.target.files[0]);

		try {
			const response = await fetch('/api/translations', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				throw Error(data.error);
			}

			fileToDownload = await response.blob();
		} catch (error: any) {
			errorMessage = error.message ?? 'Something went wrong.';
		}

		isLoading = false;
	}

	const downloadFile = () => {
		if (!fileToDownload) return;

		const downloadUrl = URL.createObjectURL(fileToDownload);

		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = downloadUrl;
		a.download = 'translations.csv';
		document.body.appendChild(a);

		a.click();

		window.setTimeout(() => {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(downloadUrl);
		}, 100);
	};
</script>

<div class="wrapper">
	<input type="file" name="file" accept=".csv" required on:change|preventDefault={handleSubmit} />

	{#if isLoading}
		<p>Loading... It can take around minute, depending on the input.</p>
	{:else if errorMessage}
		<p class="error">{errorMessage}</p>
	{:else if fileToDownload}
		<button type="button" on:click|preventDefault={downloadFile}>DOWNLOAD</button>
	{/if}
</div>

<style>
	p {
		margin: 0;
	}

	.wrapper {
		display: grid;
		place-items: center;
	}

	.error {
		color: red;
	}
</style>
