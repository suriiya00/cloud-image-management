export default function UploadPanel({ file, loading, onFileChange, onUpload }) {
  return (
    <section className="upload-panel">
      <div>
        <h3>Upload Image</h3>
        <input type="file" accept="image/jpeg,image/png,image/webp"
          onChange={event => onFileChange(event.target.files?.[0] || null)} />
      </div>
      <button disabled={!file || loading} onClick={onUpload}>
        {loading ? "Processing..." : "Upload Image"}
      </button>
    </section>
  );
}