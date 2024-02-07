<script type="ts">
	let fileToDownload: Blob | null = null;

	async function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await fetch('/api/translations', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			console.error('File upload failed:', await response.text());
			return;
		}

		fileToDownload = await response.blob();
	}

	const downloadFile = () => {
		if (!fileToDownload) return;

		const downloadUrl = URL.createObjectURL(fileToDownload);

		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = downloadUrl;
		a.download = 'downloaded_file.csv';
		document.body.appendChild(a);

		a.click();

		window.setTimeout(() => {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(downloadUrl);
		}, 100);
	};
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="file" name="file" accept=".csv" required />
	<button type="submit">Submit</button>
</form>
{#if fileToDownload}
	<button type="button" on:click|preventDefault={downloadFile}>DOWNLOAD</button>
{/if}
