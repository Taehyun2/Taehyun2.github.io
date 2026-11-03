import { useState } from "react";

// 실제 AI 결과가 아닌 UI 테스트용 데이터
function createMockReviews(code) {
  const lines = code.split("\n");

  return [
    {
      id: crypto.randomUUID(),
      category: "가독성",
      severity: "info",
      line: 1,
      title: "코드 가독성 확인",
      description:
        "함수와 변수 이름을 명확하게 작성했는지 확인해보세요.",
      status: "pending"
    },
    {
      id: crypto.randomUUID(),
      category: "안정성",
      severity: "warning",
      line: Math.min(2, Math.max(1, lines.length)),
      title: "입력값 검증 검토",
      description:
        "외부 입력을 처리하는 코드라면 유효성 검사를 추가하는 것이 좋습니다.",
      status: "pending"
    },
    {
      id: crypto.randomUUID(),
      category: "유지보수",
      severity: "info",
      line: 1,
      title: "주석 및 함수 구조 확인",
      description:
        "복잡한 로직에는 필요한 설명을 추가하고 함수를 분리하는 것을 검토해보세요.",
      status: "pending"
    }
  ];
}

export default function AIReviewPanel({
  code,
  fileName,
  language
}) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewTime, setReviewTime] = useState(null);

  function requestReview() {
    if (!code.trim()) {
      setMessage("코드를 먼저 작성해주세요.");
      return;
    }

    setLoading(true);
    setMessage("");
    setReviews([]);
    setReviewTime(null);

    // 현재는 서버 대신 테스트용 결과 생성
    const startTime = Date.now();

    const results = createMockReviews(code);

    setReviews(results);
    setReviewTime(Date.now() - startTime);
    setLoading(false);
    setMessage("테스트용 리뷰가 생성되었습니다.");
  }

  function updateReviewStatus(id, status) {
    setReviews((previous) =>
      previous.map((review) =>
        review.id === id
          ? { ...review, status }
          : review
      )
    );
  }

  const accepted = reviews.filter(
    (review) => review.status === "accepted"
  ).length;

  const rejected = reviews.filter(
    (review) => review.status === "rejected"
  ).length;

  const acceptanceRate =
    reviews.length > 0
      ? ((accepted / reviews.length) * 100).toFixed(1)
      : "0.0";

  return (
    <section className="review-panel">
      <h3>✨ AI Code Review</h3>

      <p className="review-file">
        {fileName} · {language}
      </p>

      <button
        className="review-request-btn"
        onClick={requestReview}
        disabled={loading}
      >
        {loading ? "분석 중..." : "AI 리뷰 요청"}
      </button>

      <p className="review-test-notice">
        테스트 모드 · 실제 AI 분석이 아닙니다.
      </p>

      {message && (
        <p className="review-message">{message}</p>
      )}

      {reviews.length > 0 && (
        <>
          <div className="review-results">
            <h4>리뷰 결과</h4>

            {reviews.map((review) => (
              <div
                className="review-card"
                key={review.id}
              >
                <div className="review-card-header">
                  <span>{review.category}</span>
                  <small>{review.line}번째 줄</small>
                </div>

                <strong>{review.title}</strong>

                <p>{review.description}</p>

                <div className="review-actions">
                  <button
                    className={
                      review.status === "accepted"
                        ? "accept-btn selected"
                        : "accept-btn"
                    }
                    onClick={() =>
                      updateReviewStatus(
                        review.id,
                        "accepted"
                      )
                    }
                  >
                    수락
                  </button>

                  <button
                    className={
                      review.status === "rejected"
                        ? "reject-btn selected"
                        : "reject-btn"
                    }
                    onClick={() =>
                      updateReviewStatus(
                        review.id,
                        "rejected"
                      )
                    }
                  >
                    거절
                  </button>
                </div>

                {review.status !== "pending" && (
                  <small className="review-decision">
                    {review.status === "accepted"
                      ? "수락됨"
                      : "거절됨"}
                  </small>
                )}
              </div>
            ))}
          </div>

          <div className="review-stats">
            <h4>리뷰 통계</h4>

            <p>전체 제안: {reviews.length}개</p>
            <p>수락: {accepted}개</p>
            <p>거절: {rejected}개</p>
            <p>수락률: {acceptanceRate}%</p>

            <small>
              테스트 처리 시간: {reviewTime}ms
            </small>
          </div>
        </>
      )}
    </section>
  );
}
