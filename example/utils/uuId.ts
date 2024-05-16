import crypto from "crypto";

const getUUID = () => "Documatic | ID: " + crypto.randomBytes(16).toString("hex");

export { getUUID }