export enum TokenType {

    // Literals
    Number = "Number",
    String = "String",

    Identifier = "Identifier", // for example, the name of a variable, function, or class.

    // keywords
    Let = "Let",
    Const = "Const",
    Function = "Function",
    Return = "Return",
    If = "If",
    Else = "Else",
    For = "For",
    While = "While",

    // Operators
    Plus = "Plus",
    Minus = "Minus",
    Multiply = "Multiply",
    Divide = "Divide",
    Assign = "Assign",
    Equals = "Equals",
    NotEquals = "NotEquals",
    LessThan = "LessThan",
    GreaterThan = "GreaterThan",
    LessThanOrEquals = "LessThanOrEquals",
    GreaterThanOrEqual = "GreaterThanOrEqual",

    // Delimiters
    OpenParenthesis = "OpenParenthesis", // (
    CloseParenthesis = "CloseParenthesis", // )
    OpenCurlyBrace = "OpenCurlyBrace", // {
    CloseCurlyBrace = "CloseCurlyBrace", // }
    Semicolon = "Semicolon", // ;
    Comma = "Comma", // ,

    // End of file
    EOF = "EOF"
}