"use client";

import { useEffect, useState } from "react";
import { getPostsByUser } from "../lib/api";
import styles from "./UserDetail.module.css";

export default function UserDetail({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId == null) {
      return;
    }
    setLoading(true);
    getPostsByUser(userId).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [userId]);

  if (userId == null) {
    return <p className={styles.placeholder}>Select a user to see their posts.</p>;
  }

  if (loading) {
    return <p className={styles.placeholder}>Loading posts...</p>;
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Posts</h2>
      <ul className={styles.posts}>
        {posts.map((post) => (
          <li key={post.id} className={styles.post}>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postBody}>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
