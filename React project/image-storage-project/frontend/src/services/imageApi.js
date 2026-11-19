const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "") + "/images";

async function request(url, options) {
  const startedAt = performance.now();

  try {
    const response = await fetch(url, options);
    const elapsed = performance.now() - startedAt;

    if (!response.ok) {
      let message = `Request failed (${response.status})`;

      try {
        const body = await response.json();
        message = body.message || message;
      } catch {
        // Keep the HTTP status message when the response is not JSON.
      }

      throw new Error(message);
    }

    return { response, elapsed };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Cannot reach the backend server");
    }
    throw error;
  }
}

export async function getConfig() {
  const { response } = await request(`${API}/config`);
  return response.json();
}

export async function getImages(mode) {
  const { response, elapsed } = await request(
    `${API}?storageMode=${mode}`
  );

  return {
    ...(await response.json()),
    elapsed
  };
}

export async function uploadImage(file, mode) {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("storageMode", mode);

  const { response, elapsed } = await request(
    `${API}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  return {
    ...(await response.json()),
    elapsed
  };
}

export async function downloadImage(id, mode) {
  const { response, elapsed } = await request(
    `${API}/${encodeURIComponent(id)}/download?storageMode=${mode}`
  );

  return {
    blob: await response.blob(),
    elapsed
  };
}

export function getPreviewUrl(id, mode) {
  return `${API}/${encodeURIComponent(id)}/content?storageMode=${mode}`;
}

export async function deleteImage(id, mode) {
  const { response, elapsed } = await request(
    `${API}/${encodeURIComponent(id)}?storageMode=${mode}`,
    { method: "DELETE" }
  );

  return {
    ...(await response.json()),
    elapsed
  };
}