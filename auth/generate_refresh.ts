import crypto from "crypto";

// Generate a new 64 digit refresh token
const generate_refresh = async () => {
  const buffer = await crypto.randomBytes(64);
  return buffer.toString("hex");
};

export default generate_refresh;
