// const result: {
//   searchUser: {
//     id: string;
//     name: string;
//     username: string;
//     avatar: string | null;
//   };
// }[];

type User = {
  id: number;
  name: string;
};

type Result = User[];

const result = [
  {
    searchUser: {
      id: 1,
      name: "ari",
    },
  },
  {
    searchUser: {
      id: 2,
      name: "amrad",
    },
  },
  {
    searchUser: {
      id: 3,
      name: "bonucci",
    },
  },
];

const data = result.reduce((prev, curr) => {
  prev.push({ id: curr.searchUser.id, name: curr.searchUser.name });
  return prev;
}, [] as Result);

console.log(data);
