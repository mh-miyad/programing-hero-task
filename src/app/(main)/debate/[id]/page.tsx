import DebateDetailsComp from "@/components/common/debateDetails";

const DebateDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <div>
      <DebateDetailsComp id={id} />
    </div>
  );
};

export default DebateDetails;
