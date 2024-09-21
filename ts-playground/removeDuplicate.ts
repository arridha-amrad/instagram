const users = [
  {
    id: 1,
    name: "ari",
  },
  {
    id: 2,
    name: "amrad",
  },
  {
    id: 2,
    name: "james",
  },
  {
    id: 3,
    name: "jane",
  },
];

const removeDuplicates = () => {
  const result = [] as typeof users;
  const seenIds = new Set<number>();
  for (const obj of users) {
    if (!seenIds.has(obj.id)) {
      seenIds.add(obj.id);
      result.push(obj);
    }
  }
  return {
    result,
    seenIds,
  };
};

console.log(removeDuplicates());

// const uniqueResult = users.filter(
//   (user, i, arr) => arr.findIndex((v) => v.id === user.id) === i,
// );

// console.log(uniqueResult);
