"use server";

export const createPostAction = async (prevState: any, formData: FormData) => {
  const images = formData.getAll("images");
  const description = formData.get("description");
  const location = formData.get("location");

  console.log({ images, description, location });

  // return {
  //   data: {
  //     images,
  //     description,
  //     location,
  //   },
  // };

  return {
    data: "ok",
  };
};
