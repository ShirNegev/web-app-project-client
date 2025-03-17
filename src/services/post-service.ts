import apiClient from "./api-client";
import {Post, PostSubmition, PostWithPagination} from "../interfaces/Post";
import { useNavigate } from "react-router-dom";

export const getAllPosts = () => {
  return new Promise<PostWithPagination>((resolve, reject) => {
    apiClient
      .get(`/posts/`)
      .then((response) => {
        resolve(response.data as PostWithPagination);
      })
      .catch((error) => {
        checkIfNotAuth(error);
        reject(error);
      });
  });
};

export const getPostById = (postId: string) => {
  return new Promise<Post>((resolve, reject) => {
    apiClient
      .get(`/posts/id/${postId}`)
      .then((response) => {
        const post = response.data as Post;
        resolve(post);
      })
      .catch((error) => {
        checkIfNotAuth(error);
        reject(error);
      });
  });
};

export const getConnectedUserPosts = () => {
  return new Promise<Post[]>((resolve, reject) => {
    apiClient
      .get(`/posts/connectedUser`)
      .then((response) => {
        const posts = response.data as Post[];
        resolve(posts);
      })
      .catch((error) => {
        checkIfNotAuth(error);
        reject(error);
      });
  });
};

export const createPost = (post: PostSubmition) => {
  return new Promise<Post>((resolve, reject) => {
    console.log("Creating post..", post);
    apiClient
      .post("/posts", post)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        checkIfNotAuth(error);
        console.log(error);
        reject(error);
      });
  });
};

export const uploadImage = (img: File) => {
  const formData = new FormData();
  formData.append('file', img);
  const request = apiClient.post('/file?file=' + img.name, formData, {
    headers: {
      'Content-Type': 'image/*',
    },
  });
  return { request };
};

export const likePost = (postId: string) => {
  return new Promise<void>((resolve, reject) => {
    apiClient
      .get(`/posts/like/${postId}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        checkIfNotAuth(error);
        console.log(error);
        reject(error);
      });
  });
};

export const unlikePost = (postId: string) => {
  return new Promise<void>((resolve, reject) => {
    apiClient
      .get(`/posts/unlike/${postId}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        checkIfNotAuth(error);
        console.log(error);
        reject(error);
      });
  });
};

export const editPost = (postId: string, post: PostSubmition) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Editing post.", postId, post);
    apiClient
      .put(`/posts/${postId}`, post)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        checkIfNotAuth(error);
        console.log(error);
        reject(error);
      });
  });
};

export const deletePost = (postId: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log("Deleting post.", postId);
    apiClient
      .delete(`/posts/${postId}`)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        checkIfNotAuth(error);
        console.log(error);
        reject(error);
      });
  });
};

const checkIfNotAuth = (error: any) => {
  console.log("there is error", error);
  if (error.response.status === 401) {
    window.location.href = "/login";
  }
}