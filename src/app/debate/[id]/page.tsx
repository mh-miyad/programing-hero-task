import DebateDetailsComp from "@/components/common/debateDetails";

const DebateDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  console.log(id);
  return (
    <div>
      <DebateDetailsComp />
    </div>
  );
};

export default DebateDetails;
