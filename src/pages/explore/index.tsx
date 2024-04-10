import { useFellowsFromBlock } from "src/hooks/useFellowsFromBlock";
import Main from "src/layout/Main";

export default function Explore() {
  const { myBlock, all } = useFellowsFromBlock();
  return (
    <Main>
      <div className="text-4xl font-playfair p-6">Explore Kernel Fellows</div>
      <div className="text-3xl p-6">All from my block:</div>
      <div className="flex flex-col gap-3 p-6">
        {myBlock?.map((fellow, k) => {
          return <div key={k}>{JSON.stringify(fellow)}</div>;
        })}
      </div>
      <div className="text-3xl p-6">All fellows:</div>
      <div className="flex flex-col gap-3 p-6">
        {all?.map((fellow, k) => {
          return <div key={k}>{JSON.stringify(fellow)}</div>;
        })}
      </div>
    </Main>
  );
}
