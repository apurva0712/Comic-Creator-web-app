document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comicForm');
    const comicPanelsContainer = document.getElementById('comicPanels');
    const comicDisplay = document.getElementById('comicDisplay');
    const errorMessage = document.getElementById('errorMessage');

    // Populate the form with input fields for each comic panel
    for (let i = 1; i <= 10; i++) {
        const panelDiv = document.createElement('div');
        panelDiv.className = 'panel';
        panelDiv.innerHTML = `
            <label for="panel${i}">Panel ${i}:</label>
            <textarea id="panel${i}" name="panel${i}" required></textarea>
        `;
        comicPanelsContainer.appendChild(panelDiv);
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Reset error message
        errorMessage.textContent = '';

        // Get text from each panel
        const panels = Array.from(form.elements)
            .filter((element) => element.tagName === 'TEXTAREA')
            .map((textarea) => textarea.value);

        try {
            // Call the text-to-image API with the user input
            const generatedImages = await query({ "inputs": panels.join("\n") });

            // Display the generated comic panels
            displayComic(generatedImages);
        } catch (error) {
            // Handle API call errors
            errorMessage.textContent = 'Failed to generate comic. Please try again.';
        }
    });

    function query(data) {
        return fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: {
                    "Accept": "image/png",
                    "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        ).then((response) => {
            if (!response.ok) {
                throw new Error('API request failed');
            }
            return response.blob();
        });
    }

    function displayComic(images) {
        // Clear previous comic panels
        comicDisplay.innerHTML = '';

        // Display each image in its respective panel
        images.forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(image);
            imgElement.alt = `Panel ${index + 1}`;
            comicDisplay.appendChild(imgElement);

            // Add speech bubble using tippy.js
            tippy(imgElement, {
                content: form.elements[`panel${index + 1}`].value,
                animation: 'scale',
                placement: 'top-start',
            });
        });
    }
});

