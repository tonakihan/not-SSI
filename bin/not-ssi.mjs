import SSI from "../index.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const ARGV = process.argv.slice(process.argv.indexOf(__filename) + 1);

if (ARGV.length < 1) throw new Error("Not found argv");
const ssi = new SSI(ARGV.pop());
ssi.processFile();
