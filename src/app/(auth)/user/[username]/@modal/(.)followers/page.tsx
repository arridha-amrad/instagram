import { auth } from "@/auth";
import { fetchUserFollowers } from "@/lib/drizzle/queries/fetchUserFollowers";
import ModalFollowers from "./ModalFollowers";
import Provider from "./Provider";

type Props = {
    params: {
        username: string;
    };
};

const Page = async ({ params: { username } }: Props) => {
    const session = await auth();
    const data = await fetchUserFollowers({
        authUserId: session?.user.id,
        username,
    });

    console.log({ data });

    return (
        <Provider data={data}>
            <ModalFollowers />
        </Provider>
    );
};

export default Page;
