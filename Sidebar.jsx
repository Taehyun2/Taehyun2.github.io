export default function Sidebar({
  files,
  activeFile,
  onSelect,
  onCreate,
  onDelete
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>EXPLORER</h3>

        <button
          type="button"
          onClick={onCreate}
          title="새 파일 만들기"
        >
          +
        </button>
      </div>

      <p>📁 PROJECT</p>

      {files.map((file) => (
        <div
          key={file.id}
          className={
            "file-item " +
            (activeFile === file.id ? "active" : "")
          }
        >
          <button
            type="button"
            className="file-name"
            onClick={() => onSelect(file.id)}
          >
            📄 {file.name}
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(file.id)}
            title="파일 삭제"
          >
            ×
          </button>
        </div>
      ))}
    </aside>
  );
}
