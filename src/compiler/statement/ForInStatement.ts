import { ts } from "../../typescript";
import { Expression } from "../expression";
import { IterationStatement } from "./IterationStatement";
import { VariableDeclarationList } from "./VariableDeclarationList";

export const ForInStatementBase = IterationStatement;
export class ForInStatement extends ForInStatementBase<ts.ForInStatement> {
    /**
     * Gets this for in statement's initializer.
     */
    getInitializer(): VariableDeclarationList | Expression {
        return this.getNodeFromCompilerNode(this.compilerNode.initializer);
    }

    /**
     * Gets this for in statement's expression.
     */
    getExpression(): Expression {
        return this.getNodeFromCompilerNode(this.compilerNode.expression);
    }
}
