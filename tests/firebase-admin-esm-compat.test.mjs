import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Firebase Admin Auth loads without synchronous ESM interop", async () => {
  const result = spawnSync(process.execPath, [
    "--no-experimental-require-module",
    "-e",
    'const auth = require("firebase-admin/auth"); if (typeof auth.getAuth !== "function") process.exit(1); const { generateKeyPairSync } = require("node:crypto"); const { retrieveSigningKeys } = require("jwks-rsa/src/utils"); const { publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 }); const jwk = { ...publicKey.export({ format: "jwk" }), kty: "RSA", use: "sig", kid: "compat-test" }; retrieveSigningKeys([jwk]).then((keys) => { if (keys.length !== 1) process.exit(1); }).catch(() => process.exit(1));',
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("lockfile pins jose to the CommonJS-compatible release only under jwks-rsa", async () => {
  const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));
  assert.equal(lock.packages["node_modules/jwks-rsa/node_modules/jose"].version, "4.15.9");
  assert.equal(lock.packages["node_modules/jose"].version, "5.10.0");
});
