import type {Token} from "../lexer/Token.ts";
import {TokenType} from "../lexer/TokenType.ts";
import type {Program} from "./Program.ts";
import type {Statement} from "./Statement.ts";
import type {VariableDeclaration} from "./VariableDeclaration.ts";
import type {Expression} from "./Expression.ts";
import type {FunctionDeclaration} from "./FunctionDeclaration.ts";
import type {ReturnStatement} from "./ReturnStatement.ts";
import type {ExpressionStatement} from "./ExpressionStatement.ts";

export class Parser {
    private readonly tokens: Token[];
    private currentPosition: number = 0;

    constructor(tokens: Token[] = []) {
        this.tokens = tokens;
    }

    private currentToken(): Token {
        return this.tokens[this.currentPosition]!;
    }

    private eat(tokenType: TokenType): Token {
        if (this.currentToken().type === tokenType) {
            return this.tokens[this.currentPosition++]!;
        }

        throw new Error(`Expected ${tokenType}, got ${this.currentToken().type} at line ${this.currentToken().line}, column ${this.currentToken().column}`);
    }

    private peek(): TokenType {
        return this.currentToken().type;
    }

    private parseVariableDeclaration(kind: "let" | "const"): VariableDeclaration {
        this.eat(kind === "let" ? TokenType.Let : TokenType.Const);
        const name = this.eat(TokenType.Identifier).value;
        let value: Expression | undefined;

        if (this.peek() === TokenType.Assign) {
            this.eat(TokenType.Assign);
            value = this.parseExpression();
        }

        this.eat(TokenType.Semicolon)
        return {type: "VariableDeclaration", kind: kind, name: name, value: value};
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        this.eat(TokenType.Function)
        const name = this.eat(TokenType.Identifier).value;
        this.eat(TokenType.OpenParenthesis);

        const params: string[] = [];
        if (this.peek() !== TokenType.CloseParenthesis) {
            params.push(this.eat(TokenType.Identifier).value);
            while (this.peek() === TokenType.Comma) {
                this.eat(TokenType.Comma);
                params.push(this.eat(TokenType.Identifier).value);
            }
        }

        this.eat(TokenType.CloseParenthesis);
        this.eat(TokenType.OpenCurlyBrace);

        const body: Statement[] = [];
        while (this.peek() !== TokenType.CloseCurlyBrace && this.peek() !== TokenType.EOF) {
            body.push(this.parseStatement());
        }

        this.eat(TokenType.CloseCurlyBrace);

        return {type: "FunctionDeclaration", name: name, params: params, body: body};
    }

    private getOperatorPrecedence(tokenType: TokenType): number {
        switch (tokenType) {
            case TokenType.Equals:
            case TokenType.NotEquals:
                return 1;

            case TokenType.LessThan:
            case TokenType.GreaterThan:
            case TokenType.LessThanOrEquals:
            case TokenType.GreaterThanOrEqual:
                return 2;

            case TokenType.Plus:
            case TokenType.Minus:
                return 3;

            case TokenType.Multiply:
            case TokenType.Divide:
                return 4;

            default:
                return 0;
        }
    }

    private parsePrimary(): Expression {
        const token = this.currentToken();
        switch (token.type) {
            case TokenType.Number:
                this.currentPosition++;
                return {type: "NumberLiteral", value: parseFloat(token.value)};

            case TokenType.String:
                this.currentPosition++;
                return {type: "StringLiteral", value: token.value};

            case TokenType.Identifier:
                this.currentPosition++;
                return {type: "Identifier", name: token.value};

            case TokenType.OpenParenthesis:
                this.currentPosition++;
                const expression = this.parseExpression();
                this.eat(TokenType.CloseParenthesis);
                return expression;

            default:
                throw new Error(`unexpected token: ${token.type} at line ${token.line}, column ${token.column}`);

        }
    }

    private parseBinaryExpression(precedence: number = 0): Expression {
        let left = this.parsePrimary();

        while (true) {
            const token = this.currentToken();
            const operator = this.getOperatorPrecedence(token.type);

            if (operator <= precedence) {
                break;
            }

            this.currentPosition++;
            const right = this.parseBinaryExpression(operator);
            left = {type: "BinaryExpression", operator: token.value, left, right};
        }

        return left;
    }

    private parseExpression(): Expression {
        return this.parseBinaryExpression();
    }

    private parseReturnStatement(): ReturnStatement {
        this.eat(TokenType.Return);
        let value: Expression | undefined;

        if (this.peek() !== TokenType.Semicolon) {
            value = this.parseExpression();
        }

        this.eat(TokenType.Semicolon);

        return {type: "ReturnStatement", value: value};
    }

    private parseExpressionStatement(): ExpressionStatement {
        const expression = this.parseExpression();
        this.eat(TokenType.Semicolon);

        return {type: "ExpressionStatement", expression: expression};
    }

    private parseStatement(): Statement {
        switch (this.peek()) {
            case TokenType.Let:
                return this.parseVariableDeclaration("let");
            case TokenType.Const:
                return this.parseVariableDeclaration("const");
            case TokenType.Function:
                return this.parseFunctionDeclaration();
            case TokenType.Return:
                return this.parseReturnStatement();
            default:
                return this.parseExpressionStatement();
        }
    }

    parse(): Program {

        const body: Statement[] = [];
        while (this.peek() !== TokenType.EOF) {
            body.push(this.parseStatement());
        }

        return {type: "Program", body: body};
    }
}