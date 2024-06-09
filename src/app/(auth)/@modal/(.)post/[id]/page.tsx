import Modal from "./Modal";

type Props = {
  params: {
    id: string;
  };
};

const Page = ({ params }: Props) => {
  return <Modal id={params.id} />;
};

export default Page;
