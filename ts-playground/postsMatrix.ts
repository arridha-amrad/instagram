const posts = [
  "post-1",
  "post-2",
  "post-3",
  "post-4",
  "post-5",
  "post-6",
  "post-7",
  "post-8",
  "post-9",
  "post-10",
];

const expectedOutput = [
  ["post-1", "post-2", "post-3"],
  ["post-4", "post-5", "post-6"],
  ["post-7", "post-8", "post-9"],
  ["post-10"],
];

// solusi 1
const createPostMatrix = (matrixLength: number) => {
  const result: string[][] = [];
  for (let i = 0; i < posts.length; i++) {
    const newArr: string[] = [];
    for (let j = 0; j < matrixLength; j++) {
      if (posts[i]) {
        newArr.push(posts[i]);
      }
      if (j === matrixLength - 1) {
        result.push(newArr);
      } else {
        i += 1;
      }
    }
  }
  return result;
};

console.log(createPostMatrix(4));
console.log(
  JSON.stringify(createPostMatrix(3)) === JSON.stringify(expectedOutput),
);
