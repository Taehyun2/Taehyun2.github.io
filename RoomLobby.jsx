import { useState } from "react";

export default function RoomLobby({ onCreate, onJoin }) {
  const [roomInput, setRoomInput] = useState("");
  const [error, setError] = useState("");

  function handleJoin(event) {
    event.preventDefault();

    const roomId = roomInput.trim().toUpperCase();

    if (!/^[A-Z0-9-]{4,40}$/.test(roomId)) {
      setError("방 ID는 영문, 숫자, 하이픈으로 4~40자여야 합니다.");
      return;
    }

    setError("");
    onJoin(roomId);
  }

  return (
    <main className="lobby">
      <div className="lobby-card">
        <h1>실시간 코드 협업</h1>
        <p>협업 방을 만들거나 기존 방에 입장하세요.</p>

        <button
          type="button"
          className="create-room-btn"
          onClick={onCreate}
        >
          + 새 협업 방 만들기
        </button>

        <div className="lobby-divider">또는</div>

        <form onSubmit={handleJoin}>
          <label htmlFor="room-id">기존 방에 입장하기</label>

          <input
            id="room-id"
            value={roomInput}
            onChange={(e) => {
              setRoomInput(e.target.value);
              setError("");
            }}
            placeholder="예: ROOM-12345678"
          />

          {error && <p className="room-error">{error}</p>}

          <button type="submit" className="join-room-btn">
            방 입장하기
          </button>
        </form>

        <p className="lobby-notice">
          현재는 UI 테스트 모드입니다.
          실시간 동기화는 서버 연결 후 사용할 수 있습니다.
        </p>
      </div>
    </main>
  );
}
