import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { Post } from "../types";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        console.log(fetchedPosts);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-6">Recent Posts</h1>
      {posts.map((post) => (
        <Card
          key={post.id}
          title={
            <Link
              to={`/post/${post.id}`}
              className="text-xl hover:text-blue-600"
            >
              {post.title}
            </Link>
          }
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          <p className="text-gray-600 mb-4">
            {post.content.substring(0, 200)}...
          </p>
          <div className="text-sm text-gray-500">
            <span>By {post.authorName}</span>
            <span className="mx-2">•</span>
            <span>
              {post.createdAt
                ? format(new Date(post.createdAt.seconds * 1000), "MMM d, yyyy")
                : "No date available"}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Home;
