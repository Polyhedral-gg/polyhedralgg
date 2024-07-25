import * as ohm from "ohm-js";

function getRand(min: number, max: number): number {
    return Math.floor(Math.random() * max - min + 1) + min;
}

function rollDice(numDice: number, numSides: number): number[] {
    if (numDice > 99) throw Error("Can't roll more than 99 dice in a single dice group!");

    const results: number[] = new Array<number>(numDice).fill(0);

    return results.map(() => {
        return getRand(1, numSides);
    });
}

function processBasicDiceNotation(numDice: number, numSides: number): DiceParseResult {
    const results = rollDice(numDice, numSides);

    return {
        val: results.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0),
        msg: `${numDice}d${numSides} (${results.join(", ")})`,
    };
}

const diceGrammar = ohm.grammar(String.raw`
    DiceNotation {
        Exp
            = AddExp
        AddExp
            = AddExp "+" MulExp  -- plus
            | AddExp "-" MulExp  -- minus
            | MulExp
        MulExp
            = MulExp "*" ExpExp  -- times
            | MulExp "/" ExpExp  -- divide
            | ExpExp
        ExpExp
            = PriExp "^" ExpExp  -- power
            | PriExp
        PriExp
            = "(" Exp ")"  -- paren
            | "+" PriExp   -- pos
            | "-" PriExp   -- neg
            | diceResult
            | number
    
        number  (a number)
            = digit+
            
        diceResult
            = number "d" number
    }
`);

export interface DiceParseResult {
    val: number;
    msg: string;
}

const sem = diceGrammar.createSemantics();

// Many cursed type assertions incoming because Ohm's api is JS and ESLint doesn't like that
sem.addOperation<DiceParseResult>("eval", {
    number(_): DiceParseResult {
        return { val: parseInt(this.sourceString), msg: this.sourceString };
    },
    diceResult(a: unknown, _, b: unknown): DiceParseResult {
        const numDice = (a as { eval(): DiceParseResult }).eval();
        const numSides = (b as { eval(): DiceParseResult }).eval();
        return processBasicDiceNotation(numDice.val, numSides.val);
    },
    AddExp_plus(a: unknown, _, b: unknown): DiceParseResult {
        const left = (a as { eval(): DiceParseResult }).eval();
        const right = (b as { eval(): DiceParseResult }).eval();
        return { val: left.val + right.val, msg: `${left.msg} + ${right.msg}` };
    },
    AddExp_minus(a: unknown, _, b: unknown): DiceParseResult {
        const left = (a as { eval(): DiceParseResult }).eval();
        const right = (b as { eval(): DiceParseResult }).eval();
        return { val: left.val - right.val, msg: `${left.msg} - ${right.msg}` };
    },
    MulExp_times(a: unknown, _, b: unknown): DiceParseResult {
        const left = (a as { eval(): DiceParseResult }).eval();
        const right = (b as { eval(): DiceParseResult }).eval();
        return { val: left.val * right.val, msg: `${left.msg} * ${right.msg}` };
    },
    MulExp_divide(a: unknown, _, b: unknown): DiceParseResult {
        const dividend = (a as { eval(): DiceParseResult }).eval();
        const divisor = (b as { eval(): DiceParseResult }).eval();
        return { val: dividend.val / divisor.val, msg: `${dividend.msg} ÷ ${divisor.msg}` };
    },
    ExpExp_power(a: unknown, _, b: unknown): DiceParseResult {
        const base = (a as { eval(): DiceParseResult }).eval();
        const exp = (b as { eval(): DiceParseResult }).eval();
        return { val: base.val ** exp.val, msg: `${base.msg} ^ ${exp.msg}` };
    },
    PriExp_paren(_, a: unknown, __): DiceParseResult {
        const res = (a as { eval(): DiceParseResult }).eval();
        return { val: res.val, msg: `(${res.msg})` };
    },
    PriExp_pos(_, a: unknown): DiceParseResult {
        const res = (a as { eval(): DiceParseResult }).eval();
        return { val: Math.abs(res.val), msg: `abs(${res.msg})` };
    },
    PriExp_neg(_, a: unknown): DiceParseResult {
        const res = (a as { eval(): DiceParseResult }).eval();
        return { val: -res.val, msg: `-(${res.msg})` };
    },
});

// const matchResult = diceGrammar.match("1 + 2 + ((4d3 / 3d1) ^ 3) - 4 * -3 / 2");
// const adapter = sem(matchResult);
// const res: DiceParseResult = (adapter.eval as () => DiceParseResult)();
// console.log(res.msg);
// console.log(res.val);

export default function parse(notation: string): DiceParseResult {
    const matchResult = diceGrammar.match(notation);

    if (matchResult.failed()) {
        throw Error("Failed to parse dice notation");
    }

    const adapter = sem(matchResult);
    return (adapter.eval as () => DiceParseResult)();
}
