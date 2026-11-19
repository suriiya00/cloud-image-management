export default function ImagePreview({ selected, previewUrl, onDownload, onDelete }) {
  return (
    <div className="panel">
      <h2>Image Renderer Area</h2>
      <div className="preview">
        {selected ? <img key={selected.id} src={previewUrl} alt={selected.name} /> : <p>Select an image to preview</p>}
      </div>
      {selected && (
        <>
          <p className="image-name">{selected.name}</p>
          <div className="actions">
            <button onClick={onDownload}>Download</button>
            <button className="danger" onClick={onDelete}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}