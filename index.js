// Пока работаем только на nodejs

import path from "path";
import fs from "fs";
import readline from "readline";

import { fileURLToPath } from "url";

const PWD = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const ARGV = process.argv.slice(process.argv.indexOf(__filename) + 1);

class SSI {
  regexp = RegExp(/\s*<!--\s*#(\w*).*-->\s*/);
  config = {
    file: undefined,
    dirname: "",
    output: ["build", "output.html"],
  };
  readLine;

  constructor(file) {
    console.log(`INFO: Works dir name (PWD) = ${PWD}`);

    this.config.file = file;
    this.config.dirname = path.dirname(file);

    this.readLine = readline.createInterface({
      input: fs.createReadStream(file),
      output: fs.createWriteStream(this.config.output.join(path.sep)),
    });
  }

  async processFile() {
    fs.promises
      .mkdir(this.config.output.slice(0, -1).join(path.sep), {
        recursive: true,
      })
      .then((_) => {
        return fs.promises.appendFile(this.config.output.join(path.sep), "");
      })
      .then(
        this.readLine.on("line", (line) => {
          console.debug("DBG: processFile: readline line:", line);

          if (this.regexp.test(line)) {
            //this.readLine.write(this._processLine(line.trim()));
          } else {
            //this.readLine.write(line);
          }
        }),
      )
      .catch((e) => {
        throw new Error(e);
      });
  }

  /** If in the function has a match instuction, then returned a new string else returned the input line.
  @param line string. Example: '<!--#include file="none.html"-->'*/
  _processLine(line) {
    switch (this.regexp.exec(line)) {
      case "include":
        return include.call(this, line);
        break;
      default:
        console.log("WARNING: Not match into line: ", line);
    }
    return line;

    /** Returnes a data of file specific in the line */
    function include(indexLine, line) {
      const local_regexp = new RegExp(/#include file=["|'](.*)["|']/);
      // This path is relative of input file
      let filePath = local_regexp.exec(line)[1];
      // Change it
      filePath = `${this.config.dirname}${path.sep}${filePath}`;

      const data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });

      //console.debug("DBG: data =", data);

      return data || "";
    }
  }
}

if (ARGV.length < 1) throw new Error("Not found argv");

const ssi = new SSI(ARGV.pop());

ssi.processFile();
