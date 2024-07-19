import Tab from "./Tab";

type Props = {
  username: string;
};

const tabs = [
  {
    name: "Posts",
    href: "",
  },
  {
    name: "Saved",
    href: "saved",
  },
  {
    name: "Tagged",
    href: "tagged",
  },
];

export default function Tabs({ username }: Props) {
  return (
    <section className="my-10 flex items-center justify-center gap-10 border-t border-skin">
      {tabs.map((tab) => (
        <Tab href={tab.href} name={tab.name} username={username} />
      ))}
    </section>
  );
}
