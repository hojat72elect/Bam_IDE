import {expect, test} from "bun:test";
import {Lexer} from "../../../src/compiler/lexer/Lexer.ts";
import {TokenType} from "../../../src/compiler/lexer/TokenType.ts";
import type {Token} from "../../../src/compiler/lexer/Token.ts";

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

test("Tokenizing multiple numbers", () => {
    const sut = new Lexer("42 123");
    const token1 = sut.nextToken();
    const token2 = sut.nextToken();

    expect(token1.type).toBe(TokenType.Number);
    expect(token1.value).toBe("42");
    expect(token1.column).toBe(1);

    expect(token2.type).toBe(TokenType.Number);
    expect(token2.value).toBe("123");
    expect(token2.column).toBe(4);
});

test("Tokenizing a string (which happens to be empty)", () => {
    const sut = new Lexer('""');
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.String);
    expect(token.value).toBe("");
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
});

test("Tokenizing a simple string", () => {
    const sut = new Lexer('"hello"');
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.String);
    expect(token.value).toBe("hello");
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
});

test("Tokenize a string with escaped characters", () => {
    const sut = new Lexer('"hello\\nworld"');
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.String);
    expect(token.value).toBe("hellonworld");
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
});

test("Tokenizing a simple identifier (like a variable name)", () => {
    const sut = new Lexer("variable");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Identifier);
    expect(token.value).toBe("variable");
    expect(token.line).toBe(1);
    expect(token.column).toBe(1);
});

test("Tokenizing an identifier with underscore", () => {
    const sut = new Lexer("_myVar");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Identifier);
    expect(token.value).toBe("_myVar");
});

test("Tokenizing an identifier name with numbers", () => {
    const sut = new Lexer("var123");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Identifier);
    expect(token.value).toBe("var123");
});

test("Tokenizing let keyword", () => {
    const sut = new Lexer("let");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Let);
    expect(token.value).toBe("let");
});

test("Tokenizing const keyword", () => {
    const sut = new Lexer("const");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Const);
    expect(token.value).toBe("const");
});

test("Tokenizing function keyword", () => {
    const sut = new Lexer("function");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Function);
    expect(token.value).toBe("function");
});

test("Tokenizing return keyword", () => {
    const sut = new Lexer("return");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Return);
    expect(token.value).toBe("return");
});

test("Tokenizing if keyword", () => {
    const sut = new Lexer("if");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.If);
    expect(token.value).toBe("if");
});

test("Tokenizing else keyword", () => {
    const sut = new Lexer("else");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Else);
    expect(token.value).toBe("else");
});

test("Tokenizing for keyword", () => {
    const sut = new Lexer("for");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.For);
    expect(token.value).toBe("for");
});

test("Tokenizing while keyword", () => {
    const sut = new Lexer("while");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.While);
    expect(token.value).toBe("while");
});

test("Tokenizing the plus operator", () => {
    const sut = new Lexer("+");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Plus);
    expect(token.value).toBe("+");
});

test("Tokenizing the minus operator", () => {
    const sut = new Lexer("-");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Minus);
    expect(token.value).toBe("-");
});

test("Tokenizing the multiplication operator", () => {
    const sut = new Lexer("*");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Multiply);
    expect(token.value).toBe("*");
});

test("Tokenizing the division operator", () => {
    const sut = new Lexer("/");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Divide);
    expect(token.value).toBe("/");
});

test("Tokenizing the assignment operator", () => {
    const sut = new Lexer("=");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Assign);
    expect(token.value).toBe("=");
});

test("Tokenizing the equality operator", () => {
    const sut = new Lexer("==");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Equals);
    expect(token.value).toBe("==");
});

test("Tokenizing the not-equals operator", () => {
    const sut = new Lexer("!=");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.NotEquals);
    expect(token.value).toBe("!=");
});

test("Tokenizing the less-than operator", () => {
    const sut = new Lexer("<");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.LessThan);
    expect(token.value).toBe("<");
});

test("Tokenize the greater-than operator", () => {
    const sut = new Lexer(">");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.GreaterThan);
    expect(token.value).toBe(">");
});

test("Tokenize the less-than-or-equals operator", () => {
    const sut = new Lexer("<=");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.LessThanOrEquals);
    expect(token.value).toBe("<=");
});

test("Tokenize the greater-than-or-equals operator", () => {
    const sut = new Lexer(">=");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.GreaterThanOrEqual);
    expect(token.value).toBe(">=");
});

test("Tokenize the opening parenthesis", () => {
    const sut = new Lexer("(");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.OpenParenthesis);
    expect(token.value).toBe("(");
});

test("Tokenize the closing parenthesis", () => {
    const sut = new Lexer(")");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.CloseParenthesis);
    expect(token.value).toBe(")");
});

test("Tokenize the opening curly brace", () => {
    const sut = new Lexer("{");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.OpenCurlyBrace);
    expect(token.value).toBe("{");
});

test("Tokenize the closing curly brace", () => {
    const sut = new Lexer("}");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.CloseCurlyBrace);
    expect(token.value).toBe("}");
});

test("Tokenize the semicolon", () => {
    const sut = new Lexer(";");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Semicolon);
    expect(token.value).toBe(";");
});

test("Tokenize the comma", () => {
    const sut = new Lexer(",");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Comma);
    expect(token.value).toBe(",");
});

test("The lexer skips the spaces of the source code", () => {
    const sut = new Lexer("   42");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Number);
    expect(token.value).toBe("42");
    expect(token.column).toBe(4);
});

test("The lexer skips tabs of the source code", () => {
    const sut = new Lexer("\t42");
    const token = sut.nextToken();

    expect(token.type).toBe(TokenType.Number);
    expect(token.value).toBe("42");
    expect(token.column).toBe(2); // the whole \t is considered as 1 column.
});

test("The lexer should handle newlines correctly", () => {
    const sut = new Lexer("42\n123");
    const token1 = sut.nextToken();
    const token2 = sut.nextToken();

    expect(token1.type).toBe(TokenType.Number);
    expect(token1.value).toBe("42");
    expect(token1.line).toBe(1);
    expect(token1.column).toBe(1);

    expect(token2.type).toBe(TokenType.Number);
    expect(token2.value).toBe("123");
    expect(token2.line).toBe(2);
    expect(token2.column).toBe(1);
});

test("The lexer should handle multiple newlines", () => {
    const sut = new Lexer("42\n\n123");
    const token1 = sut.nextToken();
    const token2 = sut.nextToken();

    expect(token1.line).toBe(1);
    expect(token2.line).toBe(3);
});

test("should return EOF at end of source code", () => {
    const sut = new Lexer("42");
    sut.nextToken(); // Consume the number
    const eofToken = sut.nextToken();

    expect(eofToken.type).toBe(TokenType.EOF);
    expect(eofToken.value).toBe("");
});

test("should return EOF token for empty input", () => {
    const sut = new Lexer("");
    const eofToken = sut.nextToken();

    expect(eofToken.type).toBe(TokenType.EOF);
    expect(eofToken.value).toBe("");
    expect(eofToken.line).toBe(1);
    expect(eofToken.column).toBe(1);
});

test("should tokenize variable declaration", () => {
    const sut = new Lexer("let x = 42;");
    const tokens: Token[] = [];
    let token = sut.nextToken();

    while (token.type !== TokenType.EOF) {
        tokens.push(token);
        token = sut.nextToken();
    }

    expect(tokens).toHaveLength(5);

    expect(tokens[0]!.type).toBe(TokenType.Let);

    expect(tokens[1]!.type).toBe(TokenType.Identifier);
    expect(tokens[1]!.value).toBe("x");

    expect(tokens[2]!.type).toBe(TokenType.Assign);

    expect(tokens[3]!.type).toBe(TokenType.Number);
    expect(tokens[3]!.value).toBe("42");

    expect(tokens[4]!.type).toBe(TokenType.Semicolon);
});

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
