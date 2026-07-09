import React, { useState } from "react";
import API from "../api";
import {
  FiEdit2,
  FiTrash2,
  FiThumbsUp,
  FiStar,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

const THEME_COLOR = "#6E026F";

export default function ReviewCard({
  review,
  currentUser,
  onUpdate,
  onDelete,
}) {
  // ================= STATES =================
  const [liked, setLiked] = useState(
    review.likes?.includes(currentUser?._id)
  );

  const [likesCount, setLikesCount] = useState(
    review.likes?.length || 0
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.comment);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= CURRENT USER =================
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ================= PERMISSIONS =================
  const isOwner =
    userInfo?._id &&
    review.user?._id &&
    String(userInfo._id) === String(review.user._id);

  const isAdmin = userInfo?.role === "admin";

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      const alreadyLiked = liked;

      setLiked(!alreadyLiked);
      setLikesCount((prev) => (alreadyLiked ? prev - 1 : prev + 1));

      await API.post(`/reviews/${review._id}/like`);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      if (!editText.trim()) {
        alert("Comment cannot be empty");
        return;
      }

      setLoading(true);

      const { data } = await API.put(`/reviews/${review._id}`, {
        comment: editText,
      });

      onUpdate?.(data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      if (!canDelete) {
        alert("Not allowed");
        return;
      }

      const confirmDelete = window.confirm("Delete this review?");
      if (!confirmDelete) return;

      setLoading(true);

      await API.delete(`/reviews/${review._id}`);

      onDelete?.(review._id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card} className="review-card">
      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <div style={styles.userInfo}>
          {/* AVATAR */}
          <div style={styles.avatar}>
            {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <strong style={styles.name}>
              {review.user?.name || "Anonymous"}
            </strong>

            {review.isVerifiedPurchase && (
              <div style={styles.verified}>
                <FiCheckCircle size={11} /> Verified Purchase
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.rightSection}>
          {/* RATING */}
          <div style={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={14}
                color={i < review.rating ? THEME_COLOR : "#ddd"}
                fill={i < review.rating ? THEME_COLOR : "none"}
              />
            ))}
          </div>

          {/* ACTION ICONS */}
          <div style={styles.iconActions}>
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.iconBtn}
                className="icon-btn"
              >
                <FiEdit2 size={13} />
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                style={{ ...styles.iconBtn, color: "#c0392b" }}
                className="icon-btn"
                disabled={loading}
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= COMMENT ================= */}
      {isEditing ? (
        <div>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={styles.textarea}
          />

          <div style={styles.editActions}>
            <button onClick={handleEdit} style={styles.saveBtn} className="save-btn">
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p style={styles.comment}>{review.comment}</p>
      )}

      {/* ================= IMAGES ================= */}
      {review.images?.length > 0 && (
        <div style={styles.imageRow}>
          {review.images.map((img, i) => (
            <img
              key={i}
              src={img.url || img}
              alt="review"
              style={styles.image}
              onClick={() => setPreviewImg(img.url || img)}
            />
          ))}
        </div>
      )}

      {/* ================= LIKE ================= */}
      <div style={styles.actions}>
        <button onClick={handleLike} style={styles.likeBtn} className="like-btn">
          <FiThumbsUp
            size={14}
            color={liked ? THEME_COLOR : "#1a1a1a"}
            fill={liked ? THEME_COLOR : "none"}
          />
          <span>{likesCount}</span>
        </button>
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {previewImg && (
        <div style={styles.modal} onClick={() => setPreviewImg(null)}>
          <button style={styles.modalClose} onClick={() => setPreviewImg(null)}>
            <FiX size={20} />
          </button>
          <img src={previewImg} alt="preview" style={styles.modalImg} />
        </div>
      )}

      <style>{`
        .review-card:hover { border-color: ${THEME_COLOR}; }
        .icon-btn:hover { background: #ececec; }
        .save-btn:hover { background: #50025f; }
        .like-btn:hover { border-color: ${THEME_COLOR}; }
      `}</style>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  card: {
    background: "#fff",
    padding: "24px",
    marginBottom: "18px",
    border: "1px solid #1a1a1a",
    transition: "border-color 0.3s ease",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
  },

  userInfo: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#1a1a1a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "15px",
  },

  name: {
    fontWeight: "800",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#1a1a1a",
  },

  verified: {
    marginTop: "5px",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: THEME_COLOR,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },

  rating: {
    display: "flex",
    gap: "2px",
  },

  iconActions: {
    display: "flex",
    gap: "8px",
  },

  iconBtn: {
    border: "1px solid #eee",
    background: "#f9f9f9",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
  },

  comment: {
    marginTop: "10px",
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#444",
  },

  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "12px",
    border: "1px solid #1a1a1a",
    fontSize: "14px",
    fontFamily: "inherit",
  },

  editActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  saveBtn: {
    background: THEME_COLOR,
    color: "#fff",
    border: "none",
    padding: "9px 18px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "0.3s",
  },

  cancelBtn: {
    background: "#eee",
    border: "none",
    padding: "9px 18px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
  },

  imageRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
    gap: "10px",
    marginTop: "16px",
  },

  image: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
    cursor: "pointer",
    border: "1px solid #eee",
  },

  actions: {
    marginTop: "16px",
  },

  likeBtn: {
    border: "1px solid #1a1a1a",
    background: "#fff",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.3s",
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  modalClose: {
    position: "absolute",
    top: "30px",
    right: "30px",
    background: "none",
    border: "1px solid #fff",
    color: "#fff",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalImg: {
    maxWidth: "90%",
    maxHeight: "90%",
  },
};