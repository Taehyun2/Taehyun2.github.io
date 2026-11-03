export default function RoomUsers({
  displayName,
  onNameChange
}) {
  return (
    <section className="users-panel">
      <h3>👥 참여자 목록</h3>

      <label htmlFor="display-name">
        내 이름
      </label>

      <input
        id="display-name"
        type="text"
        maxLength={20}
        value={displayName}
        onChange={(event) =>
          onNameChange(event.target.value)
        }
        placeholder="이름 입력"
      />

      <div className="user-item">
        <div className="user-avatar">
          {displayName.trim().charAt(0) || "나"}
        </div>

        <div className="user-details">
          <strong>
            {displayName.trim() || "이름 없음"}
          </strong>
          <span>현재 사용자 · 로컬</span>
        </div>
      </div>

      <p className="users-notice">
        서버 연결 전입니다.
        다른 참여자의 접속 정보는
        Socket.IO 연동 후 표시됩니다.
      </p>
    </section>
  );
}
