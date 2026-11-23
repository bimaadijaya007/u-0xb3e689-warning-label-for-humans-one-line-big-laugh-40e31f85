// Warning Label for Humans: One Line, Big Laugh — make.fun entry
// One original line: the safety warning label that should come printed on
// every human being. The program writes that single line to /output/entry.txt
// for the sealed scorer to check (UTF-8, 1-160 characters, single line).
// Before writing, it validates the line itself and verifies the round-trip.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LABEL =
  "WARNING: This human has never once read the instructions it is now explaining to you.";

function main(): void {
  const line = LABEL.trim();
  if (line.length < 1 || line.length > 160) {
    throw new Error(`label must be 1-160 characters, got ${line.length}`);
  }
  if (!/\S/.test(line)) {
    throw new Error("label must not be only whitespace");
  }
  if (line.includes("\n")) {
    throw new Error("label must be a single line");
  }
  // A printed label carries no control characters: strip nothing, reject them.
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("label must not contain control characters");
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", line + "\n", { encoding: "utf8", mode: 0o644 });
  const back = readFileSync("/output/entry.txt", "utf8").replace(/\n$/, "");
  if (back !== line) {
    throw new Error("round-trip mismatch in /output/entry.txt");
  }
  console.log(`wrote /output/entry.txt (${line.length} chars): ${line}`);
}

main();
