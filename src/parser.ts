import { ASTNode, Token } from "./types";

//parser.ts
export const parser = (tokens: Token[]): ASTNode => {
  if (!tokens.length) {
    throw new Error("No tokens to parse");
  }
  let current = 0;

  function newIndex() {
    return tokens[++current];
  }

  function parseValue(): ASTNode {
    const token = tokens[current];
    switch (token.type) {
      case "String":
        return { type: "String", value: token.value };
      case "Number":
        return { type: "Number", value: Number(token.value) };
      case "True":
        return { type: "Boolean", value: true };
      case "False":
        return { type: "Boolean", value: false };
      case "Null":
        return { type: "Null" };
      case "BraceOpen":
        return parseObject();
      case "BracketOpen":
        return parseArray();
      default:
        throw new Error(`Unexpected token type: ${token.type}`);
    }
  }

  function parseObject() {
    const node: ASTNode = { type: "Object", value: {} };
    let token = newIndex(); 

    while (token.type !== "BraceClose") {
      if (token.type === "String") {
        const key = token.value;
        token = newIndex();
        if (token.type !== "Colon")
          throw new Error("Expected : in key-value pair");
        token = newIndex(); 
        const value = parseValue(); // Recursively parsing the value
        node.value[key] = value;
      } else {
        throw new Error(`Invalid Token. Token type: ${token.type}`);
      }
      token = newIndex();
      if (token.type === "Comma") token = newIndex();
    }

    return node;
  }

  function parseArray() {
    const node: ASTNode = { type: "Array", value: [] };
    let token = newIndex(); // Eat '{'

    while (token.type !== "BracketClose") {
      const value = parseValue();
      node.value.push(value);

      token = newIndex(); // Eat value or ','
      if (token.type === "Comma") token = newIndex(); // Eat ',' if present
    }

    return node;
  }

  const AST = parseValue();

  return AST;
};
