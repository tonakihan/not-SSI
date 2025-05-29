// Пока работаем только на nodejs

import path from "path";
import fs from "fs";
import readline from "readline";

const PWD = process.cwd();

class SSI {
  regexp = RegExp(/\s*<!--\s*#(\w*).*-->\s*/);
  config = {
    file: undefined,
    dirname: "",
    output: ["build", "output.html"],
  };
  rl;

  constructor(file) {
    console.log(`INFO: Works dir name (PWD) = ${PWD}`);
    console.log(`INFO: Output = ${this.config.output.join(path.sep)}`);

    this.config.file = file;
    this.config.dirname = path.dirname(file);

    this.rl = readline.createInterface({
      input: fs.createReadStream(file),
      terminal: false,
    });
  }

  async processFile() {
    await fs.promises
      .mkdir(this.config.output.slice(0, -1).join(path.sep), {
        recursive: true,
      })
      .then((_) => {
        return fs.promises.appendFile(this.config.output.join(path.sep), "", {
          flag: "w",
          encoding: "utf-8",
        });
      })
      .then(
        this.rl.on("line", (line) => {
          //console.debug(`DBG: processFile: rl line: ${line} END_DBG_MSG`);

          // TODO: Можно и вынести в _processLine
          if (this.regexp.test(line)) {
            line = this._processLine(line);
          }

          fs.promises.appendFile(
            this.config.output.join(path.sep),
            `${line}\n`,
          );
        }),
      )
      .catch((e) => {
        throw new Error(e);
      });
  }

  /** If in the function has a match instuction, then returned a new string else returned the input line.
  @param line string. Example: '<!--#include file="none.html"-->'*/
  _processLine(line) {
    switch (this.regexp.exec(line)[1] || "") {
      case "include":
        return include.call(this, line);
        break;
      default:
        console.log("WARNING: Not match into line: ", line);
    }
    return line;

    /** Returnes a data of file specific in the line */
    function include(line) {
      //console.debug("DBG: include input:", line);
      const local_regexp = new RegExp(/#include file=["|'](.*)["|']/);
      // This path is relative of input file
      let filePath = local_regexp.exec(line)[1];
      // Change it
      filePath = `${this.config.dirname}${path.sep}${filePath}`;

      const data = fs.readFileSync(filePath, { encoding: "utf-8", flag: "r" });

      //console.debug("DBG: data =", data);

      return data || "";
    }
  }
}

export default SSI;
