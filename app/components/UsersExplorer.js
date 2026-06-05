"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../lib/api";
import UserCard from "./UserCard";
import UserDetail from "./UserDetail";
import styles from "./UsersExplorer.module.css";

export default function UsersExplorer() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function handleSelect(userId) {
    setSelectedUserId(userId);
  }

  function handleToggleFavorite(userId) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, favorite: !u.favorite } : u))
    );
  }

  if (loading) {
    return <p className={styles.status}>Loading users...</p>;
  }

  if (error) {
    return <p className={styles.error}>Something went wrong: {error}</p>;
  }

  return (
    <div className={styles.layout}>
      <section className={styles.list}>
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isSelected={user.id === selectedUserId}
            onSelect={handleSelect}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </section>
      <section className={styles.detail}>
        <UserDetail userId={selectedUserId} />
      </section>
    </div>
  );
}
