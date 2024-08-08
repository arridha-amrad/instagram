import db from "../../db";
import { TSearchUser } from "../../queries/type";

export const findUsers = async (searchKey: string): Promise<TSearchUser[]> => {
  const result = await db.query.UsersTable.findMany({
    columns: {
      avatar: true,
      id: true,
      name: true,
      username: true,
    },
    limit: 10,
    where(fields, { or, ilike }) {
      return or(
        ilike(fields.username, `%${searchKey}%`),
        ilike(fields.name, `%${searchKey}%`),
      );
    },
  });

  return result;
};
