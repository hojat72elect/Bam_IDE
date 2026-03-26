import {expect, test} from "bun:test";
import {Lexer} from "../../../src/compiler/lexer/Lexer.ts";
import {TokenType} from "../../../src/compiler/lexer/TokenType.ts";

test("Tokenizing a single digit number", () => {
    const sut = new Lexer("5");
    const token = sut.nextToken();

    console.log(token);
    expect(token.type).toBe(TokenType.Number);
    expect(token.value).toBe("5");
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
});

test("Tokenizing multi-digit numbers", () => {
    const sut = new Lexer("3262026");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Number);
    expect(token.value).toBe("3262026");
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
});

// test("should tokenize multiple numbers", () => {
//     const lexer = new Lexer("42 123");
//     const token1 = lexer.nextToken();
//     const token2 = lexer.nextToken();
//
//     expect(token1.type).toBe(TokenType.Number);
//     expect(token1.value).toBe("42");
//     expect(token1.column).toBe(1);
//
//     expect(token2.type).toBe(TokenType.Number);
//     expect(token2.value).toBe("123");
//     expect(token2.column).toBe(4);
// });

// test("should tokenize empty string", () => {
//     const lexer = new Lexer('""');
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.String);
//     expect(token.value).toBe("");
//     expect(token.line).toBe(1);
//     expect(token.column).toBe(1);
// });

// test("should tokenize simple string", () => {
//     const lexer = new Lexer('"hello"');
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.String);
//     expect(token.value).toBe("hello");
//     expect(token.line).toBe(1);
//     expect(token.column).toBe(1);
// });

// test("should tokenize string with escaped characters", () => {
//     const lexer = new Lexer('"hello\\nworld"');
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.String);
//     expect(token.value).toBe("hellonworld");
//     expect(token.line).toBe(1);
//     expect(token.column).toBe(1);
// });

// test("should tokenize string with spaces", () => {
//     const lexer = new Lexer('"hello world"');
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.String);
//     expect(token.value).toBe("hello world");
// });

// test("should tokenize simple identifier", () => {
//     const lexer = new Lexer("variable");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Identifier);
//     expect(token.value).toBe("variable");
//     expect(token.line).toBe(1);
//     expect(token.column).toBe(1);
// });

// test("should tokenize identifier with underscore", () => {
//     const lexer = new Lexer("_myVar");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Identifier);
//     expect(token.value).toBe("_myVar");
// });

// test("should tokenize identifier with numbers", () => {
//     const lexer = new Lexer("var123");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Identifier);
//     expect(token.value).toBe("var123");
// });

// test("should tokenize let keyword", () => {
//     const lexer = new Lexer("let");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Let);
//     expect(token.value).toBe("let");
// });

// test("should tokenize const keyword", () => {
//     const lexer = new Lexer("const");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Const);
//     expect(token.value).toBe("const");
// });

// test("should tokenize function keyword", () => {
//     const lexer = new Lexer("function");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Function);
//     expect(token.value).toBe("function");
// });

// test("should tokenize return keyword", () => {
//     const lexer = new Lexer("return");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Return);
//     expect(token.value).toBe("return");
// });

// test("should tokenize if keyword", () => {
//     const lexer = new Lexer("if");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.If);
//     expect(token.value).toBe("if");
// });

// test("should tokenize else keyword", () => {
//     const lexer = new Lexer("else");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Else);
//     expect(token.value).toBe("else");
// });

// test("should tokenize for keyword", () => {
//     const lexer = new Lexer("for");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.For);
//     expect(token.value).toBe("for");
// });

// test("should tokenize while keyword", () => {
//     const lexer = new Lexer("while");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.While);
//     expect(token.value).toBe("while");
// });

// test("should tokenize plus operator", () => {
//     const lexer = new Lexer("+");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Plus);
//     expect(token.value).toBe("+");
// });

// test("should tokenize minus operator", () => {
//     const lexer = new Lexer("-");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Minus);
//     expect(token.value).toBe("-");
// });

// test("should tokenize multiply operator", () => {
//     const lexer = new Lexer("*");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Multiply);
//     expect(token.value).toBe("*");
// });

// test("should tokenize divide operator", () => {
//     const lexer = new Lexer("/");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Divide);
//     expect(token.value).toBe("/");
// });

// test("should tokenize assignment operator", () => {
//     const lexer = new Lexer("=");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Assign);
//     expect(token.value).toBe("=");
// });

// test("should tokenize equality operator", () => {
//     const lexer = new Lexer("==");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Equals);
//     expect(token.value).toBe("==");
// });

// test("should tokenize not equals operator", () => {
//     const lexer = new Lexer("!=");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.NotEquals);
//     expect(token.value).toBe("!=");
// });

// test("should tokenize less than operator", () => {
//     const lexer = new Lexer("<");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.LessThan);
//     expect(token.value).toBe("<");
// });

// test("should tokenize greater than operator", () => {
//     const lexer = new Lexer(">");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.GreaterThan);
//     expect(token.value).toBe(">");
// });

// test("should tokenize less than or equals operator", () => {
//     const lexer = new Lexer("<=");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.LessThanOrEquals);
//     expect(token.value).toBe("<=");
// });

// test("should tokenize greater than or equals operator", () => {
//     const lexer = new Lexer(">=");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.GreaterThanOrEqual);
//     expect(token.value).toBe(">=");
// });

// test("should tokenize open parenthesis", () => {
//     const lexer = new Lexer("(");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.OpenParenthesis);
//     expect(token.value).toBe("(");
// });

// test("should tokenize close parenthesis", () => {
//     const lexer = new Lexer(")");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.CloseParenthesis);
//     expect(token.value).toBe(")");
// });

// test("should tokenize open curly brace", () => {
//     const lexer = new Lexer("{");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.OpenCurlyBrace);
//     expect(token.value).toBe("{");
// });

// test("should tokenize close curly brace", () => {
//     const lexer = new Lexer("}");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.CloseCurlyBrace);
//     expect(token.value).toBe("}");
// });

// test("should tokenize semicolon", () => {
//     const lexer = new Lexer(";");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Semicolon);
//     expect(token.value).toBe(";");
// });

// test("should tokenize comma", () => {
//     const lexer = new Lexer(",");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Comma);
//     expect(token.value).toBe(",");
// });

// test("should skip spaces", () => {
//     const lexer = new Lexer("   42");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Number);
//     expect(token.value).toBe("42");
//     expect(token.column).toBe(4);
// });

// test("should skip tabs", () => {
//     const lexer = new Lexer("\t42");
//     const token = lexer.nextToken();
//
//     expect(token.type).toBe(TokenType.Number);
//     expect(token.value).toBe("42");
//     expect(token.column).toBe(2);
// });

// test("should handle newlines correctly", () => {
//     const lexer = new Lexer("42\n123");
//     const token1 = lexer.nextToken();
//     const token2 = lexer.nextToken();
//
//     expect(token1.type).toBe(TokenType.Number);
//     expect(token1.value).toBe("42");
//     expect(token1.line).toBe(1);
//     expect(token1.column).toBe(1);
//
//     expect(token2.type).toBe(TokenType.Number);
//     expect(token2.value).toBe("123");
//     expect(token2.line).toBe(2);
//     expect(token2.column).toBe(1);
// });

// test("should handle multiple newlines", () => {
//     const lexer = new Lexer("42\n\n123");
//     const token1 = lexer.nextToken();
//     const token2 = lexer.nextToken();
//
//     expect(token1.line).toBe(1);
//     expect(token2.line).toBe(3);
// });

// test("should return EOF token at end of input", () => {
//     const lexer = new Lexer("42");
//     lexer.nextToken(); // Consume the number
//     const eofToken = lexer.nextToken();
//
//     expect(eofToken.type).toBe(TokenType.EOF);
//     expect(eofToken.value).toBe("");
// });

// test("should return EOF token for empty input", () => {
//     const lexer = new Lexer("");
//     const eofToken = lexer.nextToken();
//
//     expect(eofToken.type).toBe(TokenType.EOF);
//     expect(eofToken.value).toBe("");
//     expect(eofToken.line).toBe(1);
//     expect(eofToken.column).toBe(1);
// });

// test("should tokenize variable declaration", () => {
//     const lexer = new Lexer("let x = 42;");
//     const tokens = [];
//     let token = lexer.nextToken();
//
//     while (token.type !== TokenType.EOF) {
//         tokens.push(token);
//         token = lexer.nextToken();
//     }
//
//     expect(tokens).toHaveLength(5);
//     expect(tokens[0]!.type).toBe(TokenType.Let);
//     expect(tokens[1]!.type).toBe(TokenType.Identifier);
//     expect(tokens[1]!.value).toBe("x");
//     expect(tokens[2]!.type).toBe(TokenType.Assign);
//     expect(tokens[3]!.type).toBe(TokenType.Number);
//     expect(tokens[3]!.value).toBe("42");
//     expect(tokens[4]!.type).toBe(TokenType.Semicolon);
// });

// test("should tokenize function declaration", () => {
//     const lexer = new Lexer("function add(a, b) { return a + b; }");
//     const tokens = lexer.tokenize();
//
//     expect(tokens).toHaveLength(14);
//     expect(tokens[0]!.type).toBe(TokenType.Function);
//     expect(tokens[1]!.type).toBe(TokenType.Identifier);
//     expect(tokens[1]!.value).toBe("add");
//     expect(tokens[2]!.type).toBe(TokenType.OpenParenthesis);
//     expect(tokens[3]!.type).toBe(TokenType.Identifier);
//     expect(tokens[3]!.value).toBe("a");
//     expect(tokens[4]!.type).toBe(TokenType.Comma);
//     expect(tokens[5]!.type).toBe(TokenType.Identifier);
//     expect(tokens[5]!.value).toBe("b");
//     expect(tokens[6]!.type).toBe(TokenType.CloseParenthesis);
//     expect(tokens[7]!.type).toBe(TokenType.OpenCurlyBrace);
//     expect(tokens[8]!.type).toBe(TokenType.Return);
//     expect(tokens[9]!.type).toBe(TokenType.Identifier);
//     expect(tokens[9]!.value).toBe("a");
//     expect(tokens[10]!.type).toBe(TokenType.Plus);
//     expect(tokens[11]!.type).toBe(TokenType.Identifier);
//     expect(tokens[11]!.value).toBe("b");
//     expect(tokens[12]!.type).toBe(TokenType.Semicolon);
//     expect(tokens[13]!.type).toBe(TokenType.CloseCurlyBrace);
// });

// test("should tokenize if statement", () => {
//     const lexer = new Lexer("if (x == 5) { return true; }");
//     const tokens = lexer.tokenize();
//
//     expect(tokens[0]!.type).toBe(TokenType.If);
//     expect(tokens[1]!.type).toBe(TokenType.OpenParenthesis);
//     expect(tokens[2]!.type).toBe(TokenType.Identifier);
//     expect(tokens[3]!.type).toBe(TokenType.Equals);
//     expect(tokens[4]!.type).toBe(TokenType.Number);
//     expect(tokens[5]!.type).toBe(TokenType.CloseParenthesis);
//     expect(tokens[6]!.type).toBe(TokenType.OpenCurlyBrace);
//     expect(tokens[7]!.type).toBe(TokenType.Return);
//     expect(tokens[8]!.type).toBe(TokenType.Identifier);
//     expect(tokens[9]!.type).toBe(TokenType.Semicolon);
//     expect(tokens[10]!.type).toBe(TokenType.CloseCurlyBrace);
// });

// test("should throw error for unexpected character", () => {
//     const lexer = new Lexer("@");
//
//     expect(() => lexer.nextToken()).toThrow("Unexpected character: @ at line 1, column 1");
// });

// test("should throw error for standalone exclamation mark", () => {
//     const lexer = new Lexer("!");
//
//     expect(() => lexer.nextToken()).toThrow("unexpected character: ! at line 1, column 1");
// });

// test("should throw error for unexpected character in expression", () => {
//     const lexer = new Lexer("let x @ 5;");
//
//     // Should work for first few tokens
//     expect(lexer.nextToken().type).toBe(TokenType.Let);
//     expect(lexer.nextToken().type).toBe(TokenType.Identifier);
//
//     // Should fail on unexpected character
//     expect(() => lexer.nextToken()).toThrow("Unexpected character: @ at line 1, column 7");
// });

// test("should tokenize entire input and return all tokens except EOF", () => {
//     const lexer = new Lexer("let x = 42;");
//     const tokens = lexer.tokenize();
//
//     expect(tokens).toHaveLength(5);
//     expect(tokens[tokens.length - 1]!.type).toBe(TokenType.Semicolon);
// });

// test("should return empty array for empty input", () => {
//     const lexer = new Lexer("");
//     const tokens = lexer.tokenize();
//
//     expect(tokens).toHaveLength(0);
// });

// test("should handle multiple lines correctly", () => {
//     const source = "let x = 5;\nlet y = 10;";
//     const lexer = new Lexer(source);
//     const tokens = lexer.tokenize();
//
//     expect(tokens).toHaveLength(10);
//
//     // Check line numbers
//     expect(tokens[0]!.line).toBe(1); // let
//     expect(tokens[4]!.line).toBe(1); // ;
//     expect(tokens[5]!.line).toBe(2); // let
//     expect(tokens[9]!.line).toBe(2); // ;
// });
