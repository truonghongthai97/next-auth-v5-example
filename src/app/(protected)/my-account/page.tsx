import apiServices from "@/services";

const MyAccountPage = async () => {
  const response = await apiServices.auth.getMe();

  console.log({ response });

  return (
    <div>
      MyAccountPage
      <pre>{JSON.stringify(response)}</pre>
    </div>
  );
};

export default MyAccountPage;
