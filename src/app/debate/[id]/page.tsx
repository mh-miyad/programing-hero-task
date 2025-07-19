const DebateDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <div>DebateDetails {id}</div>;
};

export default DebateDetails;
