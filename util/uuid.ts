import uuid from "uuid-random";

// Generate a random, long uuid
const random_uuid = () => `${uuid()}-${uuid()}`;

export default random_uuid;
