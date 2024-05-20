//parser.ts

import { parser } from "./parser";
import { tokenizer } from "./tokenizer";

console.log(
  parser(
    tokenizer(`{
  "id": 12,
  "index": 0,
  "anArray": [],
  "boolean": true,
  "nullValue": {
    "key": "value"
  }
}
`)
  )
);
