import {TokenType} from "./TokenType.ts";
import type {Token} from "./Token.ts";

export class Lexer {

    private readonly sourceCode: string;
    private currentPosition = 0;
    private currentLine = 1;
    private currentColumn = 1;

    constructor(sourceCode: string) {
        this.sourceCode = sourceCode;
    }

    private isWhitespace(character: string): boolean {
        return character === ' ' || character === '\t' || character === '\r' || character === '\n';
    }

    private isDigit(character: string) {
        return character >= '0' && character <= '9';
    }

    /**
     * Please remember that for the sake of a compiler, we're considering '_' to
     * be part of alphabet as well.
     */
    private isAlpha(character: string) {
        return (character >= 'a' && character <= 'z') || (character >= 'A' && character <= 'Z') || character === '_';
    }

    private isAlphaNumeric(character: string) {
        return this.isAlpha(character) || this.isDigit(character);
    }

    /**
     * You give it an identifier, and if that identifier is a keyword, the function
     * will determine it for you. Otherwise, it will just tell you this is a mere identifier.
     */
    private getKeywordToken(identifier: string) {
        const keywords: Record<string, TokenType> = {
            "let": TokenType.Let,
            "const": TokenType.Const,
            "function": TokenType.Function,
            "return": TokenType.Return,
            "if": TokenType.If,
            "else": TokenType.Else,
            "for": TokenType.For,
            "while": TokenType.While
        };

        return keywords[identifier] || TokenType.Identifier;
    }

    /**
     * Reads numeric literals from the source code and returns them as a number token.
     */
    private readNumber(): Token {
        let value = "";
        const startColumn = this.currentColumn;

        while (this.currentPosition < this.sourceCode.length && this.isDigit(this.sourceCode[this.currentPosition]!)) {
            // The identifier in this position is a number
            value += this.sourceCode[this.currentPosition];
            this.currentPosition++;
            this.currentColumn++;
        }

        return {
            type: TokenType.Number,
            value: value,
            line: this.currentLine,
            column: startColumn
        };
    }

    /**
     * Reads an identifier from the source code. This identifier might be
     * the name of a variable, function, class, interface, or it might be
     * a keyword of the TypeScript programming language.
     */
    private readIdentifier(): Token {
        let value = "";
        const startColumn = this.currentColumn;

        while (this.currentPosition < this.sourceCode.length && this.isAlphaNumeric(this.sourceCode[this.currentPosition]!)) {
            value += this.sourceCode[this.currentPosition];
            this.currentPosition++;
            this.currentColumn++;
        }

        return {
            type: this.getKeywordToken(value),
            value: value,
            line: this.currentLine,
            column: startColumn
        };
    }

    private readString(): Token {
        let value = "";
        const startColumn = this.currentColumn;
        this.currentPosition++ // for skipping the opening quote of the string (' or ")
        this.currentColumn++;

        while (this.currentPosition < this.sourceCode.length && this.sourceCode[this.currentPosition] !== '"') {
            if (this.sourceCode[this.currentPosition] === "\\") {
                this.currentPosition++;
                this.currentColumn++;
                value += this.sourceCode[this.currentPosition];
            } else {
                value += this.sourceCode[this.currentPosition];
            }

            this.currentPosition++;
            this.currentColumn++;
        }

        this.currentPosition++; // Skip the closing quote (' or ")
        this.currentColumn++;

        return {
            type: TokenType.String,
            value: value,
            line: this.currentLine,
            column: startColumn
        };

    }

    /**
     * It's an easy way of allowing the lexer to get the next token from the source
     * code text, without dealing with whitespace or any creepy stuff like that.
     */
    nextToken(): Token {
        // Skip whitespace
        while (this.currentPosition < this.sourceCode.length && this.isWhitespace(this.sourceCode[this.currentPosition]!)) {
            if (this.sourceCode[this.currentPosition] === "\n") {
                this.currentLine++;
                this.currentColumn = 1;
            } else {
                this.currentColumn++;
            }
            this.currentPosition++;
        }

        if (this.currentPosition >= this.sourceCode.length) {
            // We got to the end of the source code
            return {
                type: TokenType.EOF,
                value: '',
                line: this.currentLine,
                column: this.currentColumn
            };
        }

        // The character containing the next token
        const character = this.sourceCode[this.currentPosition]!;

        // Consider the character as a number
        if (this.isDigit(character)) {
            return this.readNumber();
        }

        // It's not a number, let's consider it as an identifier or a keyword
        if (this.isAlpha(character)) {
            return this.readIdentifier();
        }

        /**
         * It's not an identifier either, let's consider it as a string. Right now we're only considering
         * (") as the starting point of a string. TODO : But we must consider (') as well in the future.
         */
        if (character === '"') {
            return this.readString();
        }

        // It wasn't a string either, let's consider it as an operator or a delimiter
        this.currentPosition++;
        const startColumn = this.currentColumn;
        this.currentColumn++;

        switch (character) {
            case '+' :
                return {type: TokenType.Plus, value: '+', line: this.currentLine, column: startColumn};
            case '-' :
                return {type: TokenType.Minus, value: '-', line: this.currentLine, column: startColumn};
            case '*' :
                return {type: TokenType.Multiply, value: '*', line: this.currentLine, column: startColumn};
            case '/' :
                return {type: TokenType.Divide, value: '/', line: this.currentLine, column: startColumn};
            case '=' :
                if (this.sourceCode[this.currentPosition] === '=') {
                    // The whole token is just a == equality sign.
                    this.currentPosition++;
                    this.currentColumn++;

                    return {type: TokenType.Equals, value: "==", line: this.currentLine, column: startColumn};
                }
                // It's an assignment(=)
                return {type: TokenType.Assign, value: '=', line: this.currentLine, column: startColumn};
            case '!':
                if (this.sourceCode[this.currentPosition] === '=') {
                    // It's an inequality operator (!=)
                    this.currentPosition++;
                    this.currentColumn++;

                    return {type: TokenType.NotEquals, value: "!=", line: this.currentLine, column: startColumn};
                }
                /*
                * We consider it as a lint error.
                * TODO : But we should later on, consider the null assetion operator as well.
                */
                throw new Error(`unexpected character: ${character} at line ${this.currentLine}, column ${startColumn}.`);

            case '<':
                if (this.sourceCode[this.currentPosition] === '=') {
                    this.currentPosition++;
                    this.currentColumn++;

                    return {type: TokenType.LessThanOrEquals, value: "<=", line: this.currentLine, column: startColumn};
                }
                // It's a simple less than operator
                return {type: TokenType.LessThan, value: '<', line: this.currentLine, column: startColumn};

            case '>':
                if (this.sourceCode[this.currentPosition] === '=') {
                    this.currentPosition++;
                    this.currentColumn++;

                    return {
                        type: TokenType.GreaterThanOrEqual,
                        value: ">=",
                        line: this.currentLine,
                        column: startColumn
                    };
                }
                // It's a simple greater than operator
                return {type: TokenType.GreaterThan, value: '>', line: this.currentLine, column: startColumn};

            case '(':
                return {type: TokenType.OpenParenthesis, value: '(', line: this.currentLine, column: startColumn};
            case ')':
                return {type: TokenType.CloseParenthesis, value: ')', line: this.currentLine, column: startColumn};
            case '{':
                return {type: TokenType.OpenCurlyBrace, value: '{', line: this.currentLine, column: startColumn};
            case '}':
                return {type: TokenType.CloseCurlyBrace, value: '}', line: this.currentLine, column: startColumn};

            case ';':
                return {type: TokenType.Semicolon, value: ';', line: this.currentLine, column: startColumn};
            case ',':
                return {type: TokenType.Comma, value: ',', line: this.currentLine, column: startColumn};

            default:
                throw new Error(`Unexpected character: ${character} at line ${this.currentLine}, column ${startColumn}`);
        }
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];
        let token = this.nextToken();

        while (token.type !== TokenType.EOF) {
            tokens.push(token);
            token = this.nextToken();
        }

        return tokens;
    }
}