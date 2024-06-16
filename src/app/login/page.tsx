import { signIn } from "@/auth";

export default function Page() {
  return (
    <form
      action={async (formData) => {
        "use server";

        await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          // redirectTo: "/my-account",
          redirectTo: "/my-account-client",
        });
      }}
    >
      <label>
        Email
        <input name="email" type="email" defaultValue="test@test.com" />
      </label>
      <label>
        Password
        <input name="password" type="password" defaultValue="xxx" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
