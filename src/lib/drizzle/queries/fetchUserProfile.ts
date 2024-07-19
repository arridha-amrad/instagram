import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

type Args = {
    username: string;
    authUserId?: string;
};

const getUser = async ({ username, authUserId }: Args) => {
    const user = await db.query.UsersTable.findFirst({
        with: {
            followers: true,
            followings: true,
            userInfo: true,
        },
        columns: {
            id: true,
            avatar: true,
            name: true,
            username: true,
        },
        where(fields, operators) {
            return operators.eq(fields.username, username);
        },
    }).then(async (user) => {
        if (user) {
            const [{ sumPosts }] = await db
                .select({
                    sumPosts: sql<number>`count(${PostsTable.id})`,
                })
                .from(PostsTable)
                .where(eq(PostsTable.userId, user.id));
            return {
                ...user,
                followers: user.followers.length,
                followings: user.followings.length,
                isFollowed: !authUserId
                    ? false
                    : !!user.followers.find((f) => f.userId === authUserId),
                sumPosts,
            };
        } else {
            return null;
        }
    });

    return user;
};

export const fetchUserProfile = unstable_cache(getUser, ["profile"], {
    tags: ["fetch-user-profile"],
});
