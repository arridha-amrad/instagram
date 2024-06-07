type Props = {
  params: {
    username: string;
  };
};

const Page = ({ params }: Props) => {
  return <main>{params.username}</main>;
};

export default Page;
