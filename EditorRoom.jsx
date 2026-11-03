import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";
import RoomUsers from "./RoomUsers";
import AIReviewPanel from "./AIReviewPanel";

const initialFiles = [
  {
    id: 1,
    name: "app.js",
    language: "javascript",
    code: "function hello() {\n  console.log('Hello World');\n}"
  }
];

function getLanguage(name) {
  const extension = name.toLowerCase().split(".").pop();

  const languages = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    py: "python",
    html: "html",
    css: "css",
    json: "json"
  };

  return languages[extension] || "plaintext";
}

export default function EditorRoom({ roomId }) {
    const [isConnected, setIsConnected] = useState(socket.connected);

useEffect(() => {
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
}, []);
  // 방 ID별로 다른 저장소 사용
  const filesKey = `ai-editor-room:${roomId}:files`;
  const activeKey = `ai-editor-room:${roomId}:active`;

  // 해당 방의 파일 불러오기
  const [files, setFiles] = useState(() => {
    try {
      const saved = localStorage.getItem(filesKey);
      const parsed = saved ? JSON.parse(saved) : null;

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.error("파일 불러오기 실패:", error);
    }

    return initialFiles;
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      const saved = localStorage.getItem(activeKey);
      return saved ? JSON.parse(saved) : 1;
    } catch {
      return 1;
    }
  });

  // 사용자 이름 불러오기
  const [displayName, setDisplayName] = useState(() => {
    try {
      return localStorage.getItem("ai-editor-name") || "사용자";
    } catch {
      return "사용자";
    }
  });

  // 방별 파일 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(filesKey, JSON.stringify(files));
    } catch (error) {
      console.error("파일 저장 실패:", error);
    }
  }, [files, filesKey]);

  // 마지막 선택 파일 저장
  useEffect(() => {
    try {
      localStorage.setItem(activeKey, JSON.stringify(activeId));
    } catch (error) {
      console.error("파일 선택 저장 실패:", error);
    }
  }, [activeId, activeKey]);

  // 사용자 이름 저장
  useEffect(() => {
    try {
      localStorage.setItem("ai-editor-name", displayName);
    } catch (error) {
      console.error("이름 저장 실패:", error);
    }
  }, [displayName]);

  const activeFile =
    files.find((file) => file.id === activeId) || files[0];

  // 파일 생성
  function createFile() {
    const name = window.prompt("새 파일 이름을 입력하세요.");
    if (name === null) return;

    const fileName = name.trim();

    if (!fileName) {
      window.alert("파일 이름을 입력해주세요.");
      return;
    }

    if (files.some((file) => file.name === fileName)) {
      window.alert("이미 같은 이름의 파일이 있습니다.");
      return;
    }

    const newFile = {
      id: crypto.randomUUID(),
      name: fileName,
      language: getLanguage(fileName),
      code: ""
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveId(newFile.id);
  }

  // 파일 삭제
  function deleteFile(id) {
    if (files.length <= 1) {
      window.alert("최소 하나의 파일은 남겨야 합니다.");
      return;
    }

    if (!window.confirm("파일을 삭제하시겠습니까?")) {
      return;
    }

    const updated = files.filter((file) => file.id !== id);
    setFiles(updated);

    if (activeId === id) {
      setActiveId(updated[0].id);
    }
  }

  // 코드 수정
  function updateCode(value) {
    const editingId = activeFile.id;

    setFiles((prev) =>
      prev.map((file) =>
        file.id === editingId
          ? { ...file, code: value }
          : file
      )
    );
  }

  return (
  <div className="workspace">
    <Sidebar
      files={files}
      activeFile={activeFile.id}
      onSelect={setActiveId}
      onCreate={createFile}
      onDelete={deleteFile}
    />

    <main className="editor-area">
      <div className="editor-tab">
        {activeFile.name}
      </div>

      <div className="editor-container">
        <CodeEditor
          key={activeFile.id}
          code={activeFile.code}
          language={activeFile.language}
          onChange={updateCode}
        />
      </div>
    </main>

    <aside className="ai-panel">
      <div className="socket-status">
        <span
          className={
            isConnected
              ? "status-dot online"
              : "status-dot offline"
          }
        />
        {isConnected ? "서버 연결됨" : "서버 연결 전"}
      </div>

      <AIReviewPanel
        key={activeFile.id}
        code={activeFile.code}
        fileName={activeFile.name}
        language={activeFile.language}
      />

      <RoomUsers
        displayName={displayName}
        onNameChange={setDisplayName}
      />
    </aside>
  </div>
);
}
