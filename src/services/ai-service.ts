import apiClient from "./api-client";

export const generatePostUsingAi = (aiPrompt: string) => {
    return new Promise<string>((resolve, reject) => {
        const requestBody = {
            prompt: aiPrompt + ". please only 5 lines."
          };

      apiClient
        .post(`/ai/generatePost`, requestBody)
        .then((response) => {
          resolve(response.data.candidates[0].content.parts[0].text);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };