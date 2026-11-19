export default function ImageTable({ images, selected, loading, onSelect, onRefresh }) {
  return (
    <div className="panel">
      <div className="panel-heading"><h2>Image Metadata Table</h2><button onClick={onRefresh}>Refresh</button></div>
      {loading && <p>Loading images...</p>}
      <div className="table-scroll">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Size</th><th>Storage</th></tr></thead>
          <tbody>
            {images.map(image => (
              <tr key={image.id} className={selected?.id === image.id ? "selected" : ""} onClick={() => onSelect(image)}>
                <td>{image.id}</td><td>{image.name}</td><td>{image.contentType}</td>
                <td>{(image.size / 1024).toFixed(2)} KB</td><td>{image.storageType}</td>
              </tr>
            ))}
            {!images.length && !loading && <tr><td colSpan="5">No images found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}