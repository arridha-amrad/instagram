import {
  createTokenForResetPassword,
  verifyTokenForResetPassword,
} from "@/lib/tokenHandler";
import { generateRandomOTP } from "@/lib/utils";

export default async function Page() {
  const token = await createTokenForResetPassword(generateRandomOTP(), "123");
  const payload = (await verifyTokenForResetPassword(token)) as {
    userId: string;
    code: string;
  };
  return (
    <div>
      <h1>Test Page</h1>
      <p>{token}</p>
      <p>{payload.code}</p>
    </div>
  );
}
