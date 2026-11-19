export default function StorageSelector({ value, onChange, provider }) {
  return (
    <div className="toolbar">
      <div>
        <label htmlFor="storage-option">Storage Option</label>
        <select id="storage-option" value={value} onChange={event => onChange(event.target.value)}>
          <option value="BLOB">Option 1 - Database BLOB</option>
          <option value="OBJECT">Option 2 - Object Storage</option>
        </select>
      </div>
      <div className="provider"><span>Cloud: </span><strong>{provider || "Not configured"}</strong></div>
    </div>
  );
}