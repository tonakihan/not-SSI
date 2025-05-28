// Пока работаем только на nodejs

import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const PWD = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const ARGV = process.argv.slice(process.argv.indexOf(__filename) + 1);

class SSI {
  regexp = RegExp(/<!--\s*#(\w*).*-->/);
  config = {
    file: undefined,
    dirname: "",
    outputDir: "build",
  };
  _listOfTarget = [];
  _listOfChanges = [];

  constructor(file) {
    console.log(`INFO: Works dir name (PWD) = ${PWD}`);

    this._isProjectDir(`${PWD}${path.sep}package.json`);
    this.config.file = file;
    this.config.dirname = path.dirname(file);
  }

  _isProjectDir(path) {
    if (!fs.existsSync(path)) {
      throw new Error("Not found project in worked dir");
    }
  }

  async processFile() {
    const data = fs.readFileSync(this.config.file, "utf8");
    const arrData = data.split("\n");
    arrData.map((line, numOfLine) => {
      if (this.regexp.test(line))
        this._listOfTarget.push([numOfLine, line.trim()]);
    });

    console.log("INFO: Found next line: \n", this._listOfTarget);

    this._listOfTarget.forEach((line) => {
      this._processLine(line);
    });

    console.log("INFO: Get next list of changes: \n", this._listOfChanges);
    return this._listOfChanges;
  }

  async replaceLineInFile() {
    //Меняем строчки
  }

  /** @param extLine element of _listOfTarget */
  _processLine(extLine) {
    switch (this.regexp.exec(extLine)[1]) {
      case "include":
        include.call(this, ...extLine);
        break;
      default:
        console.log("WARNING: Not match into line", extLine[0] + 1);
    }
    return null;

    // Return path of file in the line
    function include(numLine, line) {
      const local_regexp = new RegExp(/#include file="(.*)"/);
      // This path is relative of input file
      let filePath = local_regexp.exec(line)[1];
      // Change it
      filePath = `${this.config.dirname}${path.sep}${filePath}`;

      const data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
      this._listOfChanges.push([numLine, data]);

      //console.debug("DBG: res =", res);

      return path || null;
    }
  }
}

if (ARGV.length < 1) throw new Error("Not found argv");

const ssi = new SSI(ARGV.pop());
ssi.processFile().then((_) => ssi.replaceLineInFile());
