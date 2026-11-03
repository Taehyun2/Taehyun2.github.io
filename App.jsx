import { useEffect, useState } from "react";
import RoomLobby from "./components/RoomLobby";
import EditorRoom from "./components/EditorRoom";
import "./App.css";

// URL에서 방 ID 확인
function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get("room")?.toUpperCase() || "";

  return /^[A-Z0-9-]{4,40}$/.test(room) ? room : null;
}

export default function App() {
  const [roomId, setRoomId] = useState(getRoomFromUrl);

  // 브라우저 뒤로가기 처리
  useEffect(() => {
    function handlePopState() {
      setRoomId(getRoomFromUrl());
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // 협업 방 입장
  function enterRoom(id) {
    const url = new URL(window.location.href);
    url.searchParams.set("room", id);

    window.history.pushState({}, "", url);
    setRoomId(id);
  }

  // 새로운 협업 방 만들기
  function createRoom() {
    const id =
      "ROOM-" + crypto.randomUUID().slice(0, 8).toUpperCase();

    enterRoom(id);
  }

  // 기존 협업 방 입장
  function joinRoom(id) {
    enterRoom(id);
  }

  // 협업 방 나가기
  function leaveRoom() {
    const url = new URL(window.location.href);
    url.searchParams.delete("room");

    window.history.pushState({}, "", url);
    setRoomId(null);
  }

  // 초대 링크 복사
  async function copyInviteLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);

    try {
      await navigator.clipboard.writeText(url.toString());
      window.alert("초대 링크가 복사되었습니다.");
    } catch {
      window.prompt("아래 링크를 복사하세요.", url.toString());
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h2>AI Collaborative IDE</h2>

        {roomId ? (
          <div className="room-controls">
            <span className="room-badge">{roomId}</span>

            <span className="connection-status">
              서버 연결 전
            </span>

            <button onClick={copyInviteLink}>
              링크 복사
            </button>

            <button onClick={leaveRoom}>
              방 나가기
            </button>
          </div>
        ) : (
          <span>실시간 협업 코드 편집기</span>
        )}
      </header>

      {roomId ? (
        <EditorRoom key={roomId} roomId={roomId} />
      ) : (
        <RoomLobby
          onCreate={createRoom}
          onJoin={joinRoom}
        />
      )}
    </div>
  );
}
