"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import apiServices from "@/services";

const MyAccountPage = () => {
  const session = useSession();

  useEffect(() => {
    (async () => {
      if (session.data?.access_token) {
        apiServices.auth.setAccessToken(session.data?.access_token);

        const response = await apiServices.auth.getMe();

        console.log("get-me", { response });
      }
    })();
  }, []);

  return (
    <div>
      MyAccountPage
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
};

export default MyAccountPage;
