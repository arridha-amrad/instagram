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

const uniqueResult = users.filter(
  (user, i, arr) => arr.findIndex((v) => v.id === user.id) === i,
);

console.log(uniqueResult);
