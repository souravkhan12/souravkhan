import "./styles.css";

export function FolderStr({ data, path, onToggle }) {
  return <TreeNode data={data} path={path} onToggle={onToggle} />;
}

function TreeNode({ data, path, onToggle }) {
  const isFolder = data.type === "folder";
  const isOpen = data.isOpen ?? false;

  function handleClick() {
    onToggle(path);
  }

  return (
    <div className="tree">
      <Box data={data} handleClick={handleClick} />

      {isFolder && isOpen && (
        <div className="tree-child">
          {data.children?.map((child, idx) => (
            <TreeNode
              key={idx}
              data={child}
              path={[...path, idx]}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Box({ data, handleClick }) {
  const isFile = data.type === "file";
  const isOpen = data.isOpen ?? false;

  return (
    <div className="box" onClick={handleClick}>
      {isFile ? "📄" : isOpen ? "📂" : "📁"} {data.name}
    </div>
  );
}
