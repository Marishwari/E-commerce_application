import React, { useState, useEffect } from "react";
import API from "../api";
import { FiStar, FiX, FiUpload, FiCheck } from "react-icons/fi";

const THEME_COLOR = "#6E026F";

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previews];

    URL.revokeObjectURL(updatedPreviews[index].url);

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async () => {
    try {
      if (!comment && images.length === 0) {
        alert("Add comment or images");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating);
      formData.append("comment", comment);

      images.forEach((file) => {
        formData.append("images", file);
      });

      const { data } = await API.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onReviewAdded(data);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);

      // reset form
      setComment("");
      setImages([]);
      setPreviews([]);
      setRating(5);
    } catch (err) {
      console.error("Review Error:", err);
      alert(err.response?.data?.message || "Error adding review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Write a Review</h3>

      {/* RATING */}
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={22}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ cursor: "pointer" }}
            color={star <= (hoverRating || rating) ? THEME_COLOR : "#ddd"}
            fill={star <= (hoverRating || rating) ? THEME_COLOR : "none"}
          />
        ))}
      </div>

      {/* Comment */}
      <textarea
        placeholder="Share your thoughts about this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={styles.textarea}
      />

      {/* Images */}
      <label style={styles.uploadLabel} className="upload-label">
        <FiUpload size={14} />
        Add Photos
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
          style={{ display: "none" }}
        />
      </label>

      {/* Preview */}
      {previews.length > 0 && (
        <div style={styles.preview}>
          {previews.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={img.url} alt="preview" style={styles.image} />

              <button onClick={() => removeImage(i)} style={styles.deleteBtn}>
                <FiX size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
        className="submit-btn"
      >
        {success ? (
          <>
            <FiCheck /> Submitted
          </>
        ) : loading ? (
          "Submitting..."
        ) : (
          "Submit Review"
        )}
      </button>

      <style>{`
        .upload-label:hover { border-color: ${THEME_COLOR}; color: ${THEME_COLOR}; }
        .submit-btn:hover { background: #50025f; }
      `}</style>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    border: "1px solid #1a1a1a",
    padding: "30px",
    marginBottom: "30px",
    background: "#fff",
  },
  heading: {
    margin: "0 0 18px 0",
    fontSize: "16px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#1a1a1a",
  },
  stars: {
    display: "flex",
    gap: "6px",
    marginBottom: "16px",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    marginBottom: "14px",
    padding: "12px",
    border: "1px solid #ccc",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #1a1a1a",
    padding: "10px 18px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    color: "#1a1a1a",
    transition: "0.3s",
  },
  preview: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  image: {
    width: "64px",
    height: "64px",
    objectFit: "cover",
    border: "1px solid #eee",
  },
  deleteBtn: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: "20px",
    padding: "13px 26px",
    cursor: "pointer",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    transition: "0.3s",
  },
};