type Props = {
  params: {
    id: string;
  };
};

const Page = ({ params }: Props) => {
  return (
    <main>
      <div>
        <h1>{params.id}</h1>
      </div>
    </main>
  );
};

export default Page;
