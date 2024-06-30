type Args = {
  id: string;
  replies: {
    id: string;
  }[];
}[];

export const sumComments = (args: Args) => {
  const commentsLength = args.length;
  const repliesLength = args
    .map((c) => c.replies)
    .filter((r) => r.length > 0)
    .reduce((total, curr) => total + curr.length, 0);
  return commentsLength + repliesLength;
};
