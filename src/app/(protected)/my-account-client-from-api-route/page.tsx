"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import apiServices from "@/services";

const MyAccountPage = () => {
  useEffect(() => {
    (async () => {
      const response1 = await fetch("/api/auth/access-token", {
        method: "GET",
      });

      const json1 = (await response1.json()) as { access_token: string };

      console.log(json1);

      apiServices.auth.setAccessToken(json1.access_token);

      const response2 = await apiServices.auth.getMe();

      console.log("get-me", { response2 });
    })();
  }, []);

  return <div>MyAccountPage</div>;
};

export default MyAccountPage;
