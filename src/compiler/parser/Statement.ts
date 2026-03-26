import type {VariableDeclaration} from "./VariableDeclaration.ts";
import type {FunctionDeclaration} from "./FunctionDeclaration.ts";
import type {ReturnStatement} from "./ReturnStatement.ts";
import type {ExpressionStatement} from "./ExpressionStatement.ts";

export type Statement = VariableDeclaration | FunctionDeclaration | ReturnStatement | ExpressionStatement;