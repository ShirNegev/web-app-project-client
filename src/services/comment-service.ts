import apiClient from "./api-client";
import Comment, {CommentSubmition} from "../interfaces/Comment";

export const createComment = (comment: CommentSubmition) => {
    return new Promise<Comment>((resolve, reject) => {
      console.log("Creating comment...");
      console.log(comment);
      apiClient
        .post(`/comments/`, comment)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };