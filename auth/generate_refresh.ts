import crypto from "crypto";

const generate_refresh = async () => {
  const buffer = await crypto.randomBytes(64);
  return buffer.toString("hex");
};

export default generate_refresh;
