import config from "@/config.env";
import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";

export default async function Page() {
  const dburl = config.DB_URL;
  function generateRandomOTP(): string {
    const bytes = new Uint8Array(5);
    // console.log({ bytes });

    crypto.getRandomValues(bytes);
    // console.log(a);

    const code = encodeBase32UpperCaseNoPadding(bytes);
    return code;
  }
  const testresult = generateRandomOTP();
  return (
    <div>
      <h1>Test Page</h1>
      <p>{dburl}</p>
      <p>{testresult}</p>
    </div>
  );
}
