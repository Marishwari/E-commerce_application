import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import ReviewCard from "./ReviewCard";
import { FiInbox } from "react-icons/fi";

const THEME_COLOR = "#6E026F";

export default function ReviewsList({
  productId,
  currentUser,
  externalReviews,
  setExternalReviews,
}) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // FETCH REVIEWS
  const fetchReviews = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const { data } = await API.get(
        `/reviews?productId=${productId}&page=${page}&limit=5`
      );

      setReviews((prev) => {
        const filtered = data.reviews.filter(
          (newItem) => !prev.some((old) => old._id === newItem._id)
        );

        return [...prev, ...filtered];
      });

      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId, page, hasMore, loading]);

  // INITIAL FETCH
  useEffect(() => {
    fetchReviews();
  }, []);

  // INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;
      const height = document.documentElement.scrollHeight;

      if (scrollY + innerHeight >= height - 300) {
        fetchReviews();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchReviews]);

  // DELETE
  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
    setExternalReviews((prev) => prev.filter((r) => r._id !== id));
  };

  // UPDATE
  const handleUpdate = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
    );

    setExternalReviews((prev) =>
      prev.map((r) => (r._id === updatedReview._id ? updatedReview : r))
    );
  };

  // MERGED REVIEWS
  const mergedReviews = [
    ...externalReviews,
    ...reviews.filter((r) => !externalReviews.some((e) => e._id === r._id)),
  ];

  return (
    <div>
      {mergedReviews.length === 0 && !loading && (
        <div style={styles.empty}>
          <FiInbox size={32} color="#ddd" />
          <p style={styles.emptyText}>No reviews yet</p>
        </div>
      )}

      {mergedReviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          currentUser={currentUser}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}

      {loading && <p style={styles.loading}>Loading reviews...</p>}

      {!hasMore && mergedReviews.length > 0 && (
        <p style={styles.end}>— End of reviews —</p>
      )}
    </div>
  );
}

const styles = {
  loading: {
    textAlign: "center",
    padding: "18px",
    color: "#999",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  end: {
    textAlign: "center",
    padding: "18px",
    color: "#bbb",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  empty: {
    textAlign: "center",
    padding: "60px 0",
    border: "1px dashed #ddd",
  },

  emptyText: {
    marginTop: "12px",
    color: "#aaa",
    fontWeight: "700",
    fontSize: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
};