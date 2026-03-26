import type {BinaryExpression} from "./BinaryExpression.ts";
import type {NumberLiteral} from "./NumberLiteral.ts";
import type {StringLiteral} from "./StringLiteral.ts";
import type {Identifier} from "./Identifier.ts";

export type Expression = BinaryExpression | NumberLiteral | StringLiteral | Identifier;