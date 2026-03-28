import {expect, test} from "bun:test";
import {Parser} from "../../../src/compiler/parser/Parser.ts";
import {TokenType} from "../../../src/compiler/lexer/TokenType.ts";
import type {Token} from "../../../src/compiler/lexer/Token.ts";
import type {VariableDeclaration} from "../../../src/compiler/parser/VariableDeclaration.ts";
import type {FunctionDeclaration} from "../../../src/compiler/parser/FunctionDeclaration.ts";
import type {ReturnStatement} from "../../../src/compiler/parser/ReturnStatement.ts";
import type {NumberLiteral} from "../../../src/compiler/parser/NumberLiteral.ts";
import type {ExpressionStatement} from "../../../src/compiler/parser/ExpressionStatement.ts";
import type {StringLiteral} from "../../../src/compiler/parser/StringLiteral.ts";
import type {Identifier} from "../../../src/compiler/parser/Identifier.ts";
import type {BinaryExpression} from "../../../src/compiler/parser/BinaryExpression.ts";

test("An empty token array, still creates a valid parser", () => {
    const sut = new Parser([]);
    expect(sut).toBeDefined();
});

test("A source code only holding single number, still creates a valid parser", () => {
    const tokens: Token[] = [
        {type: TokenType.Number, value: "42", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    expect(sut).toBeDefined();
});

test("let variable declaration without initialization", () => {
    // let x;

    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);
    const xVariableDeclaration = result.body[0] as VariableDeclaration;
    expect(xVariableDeclaration.type).toBe("VariableDeclaration"); // variable declaration
    expect(xVariableDeclaration.kind).toBe("let");
    expect(xVariableDeclaration.name).toBe("x");
    expect(xVariableDeclaration.value).toBeUndefined();
});

test("const variable declaration without initialization", () => {
    //const y;

    const tokens: Token[] = [
        {type: TokenType.Const, value: "const", line: 1, column: 1},
        {type: TokenType.Identifier, value: "y", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const yVariableDeclaration = result.body[0] as VariableDeclaration;
    expect(yVariableDeclaration.type).toBe("VariableDeclaration");
    expect(yVariableDeclaration.kind).toBe("const");
    expect(yVariableDeclaration.name).toBe("y");
    expect(yVariableDeclaration.value).toBeUndefined();
});

test("let variable declaration with number initialization", () => {
    //let age = 25;

    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "age", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.Number, value: "25", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const numberDeclaration = result.body[0] as VariableDeclaration;
    expect(numberDeclaration.type).toBe("VariableDeclaration");
    expect(numberDeclaration.name).toBe("age");
    expect(numberDeclaration.value).toEqual({
        type: "NumberLiteral",
        value: 25
    });
});

test("const variable declaration with string initialization", () => {
    //const name = "John";

    const tokens: Token[] = [
        {type: TokenType.Const, value: "const", line: 1, column: 1},
        {type: TokenType.Identifier, value: "name", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.String, value: "John", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const stringDeclaration = result.body[0] as VariableDeclaration;
    expect(stringDeclaration.type).toBe("VariableDeclaration");
    expect(stringDeclaration.name).toBe("name");
    expect(stringDeclaration.value).toEqual({
        type: "StringLiteral",
        value: "John"
    });
});

test("Assigning the value of a variable to another variable", () => {
    //let copy = original;

    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "copy", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.Identifier, value: "original", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);
    expect(result.body[0]!.type).toBe("VariableDeclaration");
    expect((result.body[0] as VariableDeclaration).value).toEqual({
        type: "Identifier",
        name: "original"
    });
});

test("should throw error when variable name is missing", () => {
    //let;

    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow("Expected Identifier");
});

test("should throw error when semicolon is missing", () => {
    // let x

    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow("Expected Semicolon");
});

test("Function declaration with no parameters", () => {
    /*function greet() {
    }*/

    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "greet", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},
        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const functionDeclaration = result.body[0] as FunctionDeclaration;
    expect(functionDeclaration.type).toBe("FunctionDeclaration");
    expect(functionDeclaration.name).toBe("greet");
    expect(functionDeclaration.params).toEqual([]);
    expect(functionDeclaration.body).toEqual([]);
});

test("Function declaration with single parameter", () => {
    //function square(x) {}

    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "square", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},
        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const functionDeclaration = result.body[0] as FunctionDeclaration;
    expect(functionDeclaration.type).toBe("FunctionDeclaration");
    expect(functionDeclaration.name).toBe("square");
    expect(functionDeclaration.params).toEqual(["x"]);
    expect(functionDeclaration.body).toEqual([]);
});

test("Function declaration with multiple parameters", () => {
    //function add(a, b, c) { }

    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "add", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Identifier, value: "a", line: 1, column: 1},
        {type: TokenType.Comma, value: ",", line: 1, column: 1},
        {type: TokenType.Identifier, value: "b", line: 1, column: 1},
        {type: TokenType.Comma, value: ",", line: 1, column: 1},
        {type: TokenType.Identifier, value: "c", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},
        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const functionDeclaration = result.body[0] as FunctionDeclaration;
    expect(functionDeclaration.type).toBe("FunctionDeclaration");
    expect(functionDeclaration.name).toBe("add");
    expect(functionDeclaration.params).toEqual(["a", "b", "c"]);
});

test("should parse function declaration with body statements", () => {
    /*
     *  function test() {
     *    let x = 5;
     *   return x;
     *  }
     */

    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "test", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const functionDeclaration = result.body[0] as FunctionDeclaration;
    expect(functionDeclaration.type).toBe("FunctionDeclaration");
    expect(functionDeclaration.body).toHaveLength(2);
    expect(functionDeclaration.body[0]!.type).toBe("VariableDeclaration");
    expect(functionDeclaration.body[1]!.type).toBe("ReturnStatement");
});

test("should throw error when function name is missing", () => {
    //function (){}

    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},
        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow("Expected Identifier");
});

/**
 * todo : honestly, I think we should have thrown an error in this situation.
 */
test("should parse return statement without value", () => {
    //return;

    const tokens: Token[] = [
        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    const returnStatement = result.body[0] as ReturnStatement;

    expect(returnStatement.type).toBe("ReturnStatement");
    expect(returnStatement.value).toBeUndefined();
});

test("should parse return statement with number value", () => {
    //return 42;

    const tokens: Token[] = [
        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Number, value: "42", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();
    expect(result.type).toBe("Program");
    expect(result.body).toHaveLength(1);

    const returnStatement = result.body[0] as ReturnStatement;
    expect(returnStatement.type).toBe("ReturnStatement");
    expect((returnStatement.value as NumberLiteral).type).toBe("NumberLiteral");
    expect((returnStatement.value as NumberLiteral).value).toBe(42);
});

test("should parse return statement with string value", () => {
    //return "hello";

    const tokens: Token[] = [
        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.String, value: "hello", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const returnStatement = result.body[0] as ReturnStatement;
    expect(returnStatement.type).toBe("ReturnStatement");
    expect(returnStatement.value).toEqual({
        type: "StringLiteral",
        value: "hello"
    });
});

test("should parse return statement with identifier value", () => {
    // return result;

    const tokens: Token[] = [
        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Identifier, value: "result", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const returnStatement = result.body[0] as ReturnStatement;
    expect(returnStatement.type).toBe("ReturnStatement");
    expect(returnStatement.value).toEqual({
        type: "Identifier",
        name: "result"
    });
});

test("should parse expression statement with number literal", () => {
    //123;

    const tokens: Token[] = [
        {type: TokenType.Number, value: "123", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expressionStatement = result.body[0] as ExpressionStatement;
    expect(expressionStatement.type).toBe("ExpressionStatement");
    expect(expressionStatement.expression).toEqual({
        type: "NumberLiteral",
        value: 123
    });
});

test("should parse expression statement with string literal", () => {
    //test;

    const tokens: Token[] = [
        {type: TokenType.String, value: "test", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression).toEqual({
        type: "StringLiteral",
        value: "test"
    });
});

test("should parse expression statement with identifier", () => {
    //x;

    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression).toEqual({
        type: "Identifier",
        name: "x"
    });
});

test("should parse number literal", () => {
    //3.14;

    const tokens: Token[] = [
        {type: TokenType.Number, value: "3.14", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression).toEqual({
        type: "NumberLiteral",
        value: 3.14
    });
});

test("should parse integer and decimal numbers", () => {
    const testCases = [
        ["0", 0],
        ["42", 42],
        ["-5", -5],
        ["3.14159", 3.14159],
        ["2.5", 2.5]
    ];

    testCases.forEach(([input, expected]) => {
        const tokens: Token[] = [
            {type: TokenType.Number, value: input as string, line: 1, column: 1},
            {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
            {type: TokenType.EOF, value: "", line: 1, column: 1}
        ];
        const sut = new Parser(tokens);
        const result = sut.parse();

        expect(((result.body[0] as ExpressionStatement).expression as NumberLiteral).value).toBe(expected as number);
    });
});

test("should parse string literal", () => {
    // "Hello, World!";

    const tokens: Token[] = [
        {type: TokenType.String, value: "Hello, World!", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression).toEqual({
        type: "StringLiteral",
        value: "Hello, World!"
    });
});

test("should parse empty string", () => {
    //"";
    const tokens: Token[] = [
        {type: TokenType.String, value: "", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as StringLiteral).value).toBe("");
});

test("should parse identifier", () => {
    //myVariable;

    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "myVariable", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression as Identifier).toEqual({
        type: "Identifier",
        name: "myVariable"
    });
});

/**
 * todo : Honestly, I think it's a bit weird that our parser doesn't throw an error in this scenario.
 */
test("should parse parenthesized expression", () => {
    //(42);
    const tokens: Token[] = [
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Number, value: "42", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression as NumberLiteral).toEqual({
        type: "NumberLiteral",
        value: 42
    });
});

test("should throw error for unexpected token", () => {
    // +
    const tokens: Token[] = [
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow("unexpected token: Plus");
});

test("should throw error when closing parenthesis is missing", () => {
    //(42;
    const tokens: Token[] = [
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Number, value: "42", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow("Expected CloseParenthesis");
});

test("should parse simple addition", () => {
    //5+3;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body[0]!.type).toBe("ExpressionStatement");
    expect((result.body[0] as ExpressionStatement).expression as BinaryExpression).toEqual({
        type: "BinaryExpression",
        operator: "+",
        left: {type: "NumberLiteral", value: 5},
        right: {type: "NumberLiteral", value: 3}
    });
});

test("should parse subtraction", () => {
    //10 - 4 ;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "10", line: 1, column: 1},
        {type: TokenType.Minus, value: "-", line: 1, column: 1},
        {type: TokenType.Number, value: "4", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect((result.body[0] as ExpressionStatement).expression as BinaryExpression).toEqual({
        type: "BinaryExpression",
        operator: "-",
        left: {type: "NumberLiteral", value: 10},
        right: {type: "NumberLiteral", value: 4}
    });
});

test("should parse multiplication", () => {
    //6*7;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "6", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 1},
        {type: TokenType.Number, value: "7", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect((result.body[0] as ExpressionStatement).expression as BinaryExpression).toEqual({
        type: "BinaryExpression",
        operator: "*",
        left: {type: "NumberLiteral", value: 6},
        right: {type: "NumberLiteral", value: 7}
    });
});

test("should parse division", () => {
    //20/4;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "20", line: 1, column: 1},
        {type: TokenType.Divide, value: "/", line: 1, column: 1},
        {type: TokenType.Number, value: "4", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect((result.body[0] as ExpressionStatement).expression as BinaryExpression).toEqual({
        type: "BinaryExpression",
        operator: "/",
        left: {type: "NumberLiteral", value: 20},
        right: {type: "NumberLiteral", value: 4}
    });
});

test("should parse equality comparison", () => {
    //5 == 5 ;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.Equals, value: "==", line: 1, column: 1},
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect((result.body[0] as ExpressionStatement).expression as BinaryExpression).toEqual({
        type: "BinaryExpression",
        operator: "==",
        left: {type: "NumberLiteral", value: 5},
        right: {type: "NumberLiteral", value: 5}
    });
});

test("should parse inequality comparison", () => {
    //x != y;
    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.NotEquals, value: "!=", line: 1, column: 1},
        {type: TokenType.Identifier, value: "y", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect((result.body[0] as ExpressionStatement).expression as BinaryExpression).toEqual({
        type: "BinaryExpression",
        operator: "!=",
        left: {type: "Identifier", name: "x"},
        right: {type: "Identifier", name: "y"}
    });
});

test("should parse less than comparison", () => {
    //a < b ;
    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "a", line: 1, column: 1},
        {type: TokenType.LessThan, value: "<", line: 1, column: 1},
        {type: TokenType.Identifier, value: "b", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as BinaryExpression).operator).toBe("<");
});

test("should parse greater than comparison", () => {
    //a > b;
    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "a", line: 1, column: 1},
        {type: TokenType.GreaterThan, value: ">", line: 1, column: 1},
        {type: TokenType.Identifier, value: "b", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as BinaryExpression).operator).toBe(">");
});

test("should parse less than or equal comparison", () => {
    //a <= b;

    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "a", line: 1, column: 1},
        {type: TokenType.LessThanOrEquals, value: "<=", line: 1, column: 1},
        {type: TokenType.Identifier, value: "b", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as BinaryExpression).operator).toBe("<=");
});

test("should parse greater than or equal comparison", () => {
    //a >= b;

    const tokens: Token[] = [
        {type: TokenType.Identifier, value: "a", line: 1, column: 1},
        {type: TokenType.GreaterThanOrEqual, value: ">=", line: 1, column: 1},
        {type: TokenType.Identifier, value: "b", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as BinaryExpression).operator).toBe(">=");
});

test("should respect multiplication precedence over addition", () => {
    //2 + 3 * 4;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 1},
        {type: TokenType.Number, value: "4", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr).toEqual({
        type: "BinaryExpression",
        operator: "+",
        left: {type: "NumberLiteral", value: 2},
        right: {
            type: "BinaryExpression",
            operator: "*",
            left: {type: "NumberLiteral", value: 3},
            right: {type: "NumberLiteral", value: 4}
        }
    });
});

test("should respect division precedence over subtraction", () => {
    //10 - 8 / 2;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "10", line: 1, column: 1},
        {type: TokenType.Minus, value: "-", line: 1, column: 1},
        {type: TokenType.Number, value: "8", line: 1, column: 1},
        {type: TokenType.Divide, value: "/", line: 1, column: 1},
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr.operator).toBe("-");
    expect(expr.left).toEqual({type: "NumberLiteral", value: 10});
    expect(expr.right.type).toBe("BinaryExpression");
    expect((expr.right as BinaryExpression).operator).toBe("/");
});

/**
 * Generally speaking, this shouldn't happen, because the result of comparison is boolean, and
 * we shouldn't perform an addition between boolean and number.
 */
test("arithmetic has higher precedence over comparison", () => {
    //5 + 3 < 10;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.LessThan, value: "<", line: 1, column: 1},
        {type: TokenType.Number, value: "10", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr).toEqual({
        type: "BinaryExpression",
        operator: "<",
        left: {
            type: "BinaryExpression",
            operator: "+",
            left: {type: "NumberLiteral", value: 5},
            right: {type: "NumberLiteral", value: 3}
        },
        right: {type: "NumberLiteral", value: 10}
    });
});

test("should respect equality precedence over comparison", () => {
    //5 < 10 == condition;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.LessThan, value: "<", line: 1, column: 1},
        {type: TokenType.Number, value: "10", line: 1, column: 1},
        {type: TokenType.Equals, value: "==", line: 1, column: 1},
        {type: TokenType.Identifier, value: "condition", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr).toEqual({
        type: "BinaryExpression",
        operator: "==",
        left: {
            type: "BinaryExpression",
            operator: "<",
            left: {type: "NumberLiteral", value: 5},
            right: {type: "NumberLiteral", value: 10}
        },
        right: {type: "Identifier", name: "condition"}
    });
});

test("should parse complex expression with multiple precedence levels", () => {
    //2 * 3 + 4 / 2 < 10 == result ;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Number, value: "4", line: 1, column: 1},
        {type: TokenType.Divide, value: "/", line: 1, column: 1},
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.LessThan, value: "<", line: 1, column: 1},
        {type: TokenType.Number, value: "10", line: 1, column: 1},
        {type: TokenType.Equals, value: "==", line: 1, column: 1},
        {type: TokenType.Identifier, value: "result", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as any).expression;
    expect(expr.type).toBe("BinaryExpression");
    expect(expr.operator).toBe("==");
    expect(expr.left.type).toBe("BinaryExpression");
    expect(expr.left.operator).toBe("<");
    expect(expr.right.type).toBe("Identifier");
});

test("should handle left-associative operators correctly", () => {
    //1 - 2 - 3;

    const tokens: Token[] = [
        {type: TokenType.Number, value: "1", line: 1, column: 1},
        {type: TokenType.Minus, value: "-", line: 1, column: 1},
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.Minus, value: "-", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr).toEqual({
        type: "BinaryExpression",
        operator: "-",
        left: {
            type: "BinaryExpression",
            operator: "-",
            left: {type: "NumberLiteral", value: 1},
            right: {type: "NumberLiteral", value: 2}
        },
        right: {type: "NumberLiteral", value: 3}
    });
});

test("should override precedence with parentheses", () => {
    //( 2 + 3 ) * 4 ;

    const tokens: Token[] = [
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 1},
        {type: TokenType.Number, value: "4", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr).toEqual({
        type: "BinaryExpression",
        operator: "*",
        left: {
            type: "BinaryExpression",
            operator: "+",
            left: {type: "NumberLiteral", value: 2},
            right: {type: "NumberLiteral", value: 3}
        },
        right: {type: "NumberLiteral", value: 4}
    });
});

test("should handle nested parentheses", () => {
    // ((1 + 2) * 3);

    const tokens: Token[] = [
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Number, value: "1", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Number, value: "2", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    const expr = (result.body[0] as ExpressionStatement).expression as BinaryExpression;
    expect(expr.type).toBe("BinaryExpression");
    expect(expr.operator).toBe("*");
    expect(expr.left.type).toBe("BinaryExpression");
    expect((expr.left as BinaryExpression).operator).toBe("+");
});

test("should parse program with multiple statements", () => {
    //let x = 5;
    //let y = 10;
    //x + y;

    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "y", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.Number, value: "10", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.Identifier, value: "x", line: 1, column: 1},
        {type: TokenType.Plus, value: "+", line: 1, column: 1},
        {type: TokenType.Identifier, value: "y", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body).toHaveLength(3);
    expect((result.body[0] as VariableDeclaration).type).toBe("VariableDeclaration");
    expect((result.body[1] as VariableDeclaration).type).toBe("VariableDeclaration");
    expect((result.body[2] as ExpressionStatement).type).toBe("ExpressionStatement");
});

test("should parse complete function with variable declarations and return", () => {
    /*
    * function calculateArea(width, height) {
    *   let area = width * height;
    *   return area;
    * }
    */
    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "calculateArea", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Identifier, value: "width", line: 1, column: 1},
        {type: TokenType.Comma, value: ",", line: 1, column: 1},
        {type: TokenType.Identifier, value: "height", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},

        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Identifier, value: "area", line: 1, column: 1},
        {type: TokenType.Assign, value: "=", line: 1, column: 1},
        {type: TokenType.Identifier, value: "width", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 1},
        {type: TokenType.Identifier, value: "height", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Identifier, value: "area", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body).toHaveLength(1);
    const func = result.body[0] as FunctionDeclaration;
    expect(func.type).toBe("FunctionDeclaration");
    expect(func.name).toBe("calculateArea");
    expect(func.params).toEqual(["width", "height"]);
    expect(func.body).toHaveLength(2);
    expect((func.body[0] as VariableDeclaration).type).toBe("VariableDeclaration");
    expect((func.body[1] as ReturnStatement).type).toBe("ReturnStatement");
});

test("should parse nested function calls", () => {
    /*
    * function outer ( ){
    *   function inner ( ){
    *       return 42;
    *       }
    *   return inner;
    *   }
    */
    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "outer", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},

        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "inner", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},

        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Number, value: "42", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},

        {type: TokenType.Return, value: "return", line: 1, column: 1},
        {type: TokenType.Identifier, value: "inner", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},

        {type: TokenType.CloseCurlyBrace, value: "}", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.body).toHaveLength(1);
    const outerFunc = result.body[0] as FunctionDeclaration;
    expect(outerFunc.type).toBe("FunctionDeclaration");
    expect(outerFunc.body).toHaveLength(2);

    const innerFunctionDeclaration = outerFunc.body[0] as FunctionDeclaration;
    expect(innerFunctionDeclaration.type).toBe("FunctionDeclaration");
    expect(innerFunctionDeclaration.name).toBe("inner");
    expect(innerFunctionDeclaration.params).toEqual([]);
    expect(innerFunctionDeclaration.body).toHaveLength(1);
    expect((innerFunctionDeclaration.body[0] as ReturnStatement).type).toBe("ReturnStatement");
    expect((outerFunc.body[1] as ReturnStatement).type).toBe("ReturnStatement");
});

test("should handle empty input", () => {
    const tokens: Token[] = [
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(result.type).toBe("Program");
    expect(result.body).toEqual([]);
});

test("should provide detailed error messages with line and column", () => {
    //let *
    const tokens: Token[] = [
        {type: TokenType.Let, value: "let", line: 1, column: 1},
        {type: TokenType.Multiply, value: "*", line: 1, column: 5},
        {type: TokenType.EOF, value: "", line: 1, column: 6}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow("Expected Identifier, got Multiply at line 1, column 5");
});

test("should handle unexpected tokens in expressions", () => {
    //5 {3;
    const tokens: Token[] = [
        {type: TokenType.Number, value: "5", line: 1, column: 1},
        {type: TokenType.OpenCurlyBrace, value: "{", line: 1, column: 1},
        {type: TokenType.Number, value: "3", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow();
});

test("should handle malformed function declarations", () => {
    // function test(param
    const tokens: Token[] = [
        {type: TokenType.Function, value: "function", line: 1, column: 1},
        {type: TokenType.Identifier, value: "test", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Identifier, value: "param", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);

    expect(() => sut.parse()).toThrow();
});

test("should handle very long identifier names", () => {
    const longName = "a".repeat(1_000);
    const tokens: Token[] = [
        {type: TokenType.Identifier, value: longName, line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as Identifier).name).toBe(longName);
});

test("should handle very large numbers", () => {
    const largeNumber = "999_999_999_999_999_999_999";
    const tokens: Token[] = [
        {type: TokenType.Number, value: largeNumber, line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as NumberLiteral).value).toBe(parseFloat(largeNumber));
});

test("should handle special characters in strings", () => {
    const specialString = "Hello\nWorld\t!";
    const tokens: Token[] = [
        {type: TokenType.String, value: specialString, line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect(((result.body[0] as ExpressionStatement).expression as StringLiteral).value).toBe(specialString);
});

test("should handle deeply nested expressions", () => {
    const tokens: Token[] = [
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.OpenParenthesis, value: "(", line: 1, column: 1},
        {type: TokenType.Number, value: "1", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.CloseParenthesis, value: ")", line: 1, column: 1},
        {type: TokenType.Semicolon, value: ";", line: 1, column: 1},
        {type: TokenType.EOF, value: "", line: 1, column: 1}
    ];
    const sut = new Parser(tokens);
    const result = sut.parse();

    expect((result.body[0] as ExpressionStatement).expression as NumberLiteral).toEqual({
        type: "NumberLiteral",
        value: 1
    });
});
