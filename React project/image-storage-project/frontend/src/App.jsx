
import React, { useEffect, useState } from "react";

import {
  getImages,
  getConfig,
  uploadImage,
  downloadImage,
  getPreviewUrl,
  deleteImage
} from "./services/imageApi";

export default function App() {
  const [option, setOption] = useState("BLOB");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadImages() {
    setLoading(true);
    setError("");

    try {
      const result = await getImages(option);

      setImages(result.data || []);
      setMetrics(previous => ({
        ...previous,
        list: result.elapsed
      }));

      setSelected(current => {
        if (current && result.data?.some(
          item => item.id === current.id
        )) return current;

        return result.data?.[0] || null;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      let initialMode = "BLOB";

      try {
        const result = await getConfig();
        setConfig(result);
        initialMode = result.storageMode || "BLOB";
        setOption(initialMode);
      } catch (err) {
        setError(err.message);
      }

      setLoading(true);

      try {
        const result = await getImages(initialMode);
        setImages(result.data || []);
        setMetrics(previous => ({
          ...previous,
          list: result.elapsed
        }));
        setSelected(result.data?.[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  async function handleUpload() {
    if (!file) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await uploadImage(file, option);

      setMetrics(previous => ({
        ...previous,
        upload: result.elapsed
      }));

      setFile(null);

      await loadImages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!selected) return;

    try {
      const result = await downloadImage(selected.id, option);

      setMetrics(previous => ({
        ...previous,
        download: result.elapsed
      }));

      const url = URL.createObjectURL(result.blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = selected.name;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!selected) return;

    if (!window.confirm(
      `Delete ${selected.name}?`
    )) return;

    try {
      await deleteImage(selected.id, option);
      setSelected(null);
      await loadImages();
    } catch (err) {
      setError(err.message);
    }
  }

  async function changeOption(value) {
    setOption(value);
    setSelected(null);
    setError("");
    setImages([]);
    setLoading(true);

    try {
      const result = await getImages(value);
      setImages(result.data || []);
      setMetrics(previous => ({
        ...previous,
        list: result.elapsed
      }));
      setSelected(result.data?.[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">

      <header className="header">
        <div>
          <h1>Image Storage Comparison</h1>
          <p>Database BLOB vs Cloud Object Storage</p>
        </div>

        <span className="status">
          {config.cloudProvider || "Cloud"} Connected
        </span>
      </header>

      <section className="toolbar">
        <div>
          <label>Storage Option</label>

          <select
            value={option}
            onChange={e => changeOption(e.target.value)}
          >
            <option value="BLOB">
              Option 1 - Database BLOB
            </option>

            <option value="OBJECT">
              Option 2 - Object Storage
            </option>
          </select>
        </div>

        <div className="provider">
          <span>Cloud: </span>
          <strong>
            {config.cloudProvider || "Not configured"}
          </strong>
        </div>
      </section>

      <section className="upload-panel">
        <div>
          <h3>Upload Image</h3>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={e =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </div>

        <button
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? "Processing..." : "Upload Image"}
        </button>
      </section>

      {error && (
        <div className="error">{error}</div>
      )}

      <section className="content">

        <div className="panel">
          <div className="panel-heading">
            <h2>Image Metadata Table</h2>
            <button onClick={loadImages}>
              Refresh
            </button>
          </div>

          {loading && <p>Loading images...</p>}

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Storage</th>
                </tr>
              </thead>

              <tbody>
                {images.map(image => (
                  <tr
                    key={image.id}
                    className={
                      selected?.id === image.id
                        ? "selected"
                        : ""
                    }
                    onClick={() => setSelected(image)}
                  >
                    <td>{image.id}</td>
                    <td>{image.name}</td>
                    <td>{image.contentType}</td>
                    <td>
                      {(image.size / 1024).toFixed(2)} KB
                    </td>
                    <td>{image.storageType}</td>
                  </tr>
                ))}

                {!images.length && !loading && (
                  <tr>
                    <td colSpan="5">No images found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2>Image Renderer Area</h2>

          <div className="preview">
            {selected ? (
              <img
                key={selected.id}
                src={getPreviewUrl(selected.id, option)}
                alt={selected.name}
              />
            ) : (
              <p>Select an image to preview</p>
            )}
          </div>

          {selected && (
            <>
              <p className="image-name">
                {selected.name}
              </p>

              <div className="actions">
                <button onClick={handleDownload}>
                  Download
                </button>

                <button
                  className="danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>

      </section>

      <section className="metrics">
        <h2>Response Time - MS</h2>

        <div className="metric-grid">
          {[
            ["List API", metrics.list],
            ["Upload API", metrics.upload],
            ["Download API", metrics.download]
          ].map(([name, value]) => (
            <div className="metric" key={name}>
              <span>{name}</span>
              <strong>
                {value == null
                  ? "--"
                  : `${value.toFixed(2)} ms`}
              </strong>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
