import * as ohm from "ohm-js";

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

interface Res {
    val: number;
    msg: string;
}

const sem = diceGrammar.createSemantics();

// Many cursed type assertions incoming because Ohm's api is JS and ESLint doesn't like that
sem.addOperation<Res>("eval", {
    number(_): Res {
        return { val: parseInt(this.sourceString), msg: this.sourceString };
    },
    diceResult(a: unknown, _, b: unknown): Res {
        const numDice = (a as { eval(): Res }).eval();
        const numSides = (b as { eval(): Res }).eval();
        return { val: 1, msg: `${numDice.msg}d${numSides.msg}` };
    },
    AddExp_plus(a: unknown, _, b: unknown): Res {
        const left = (a as { eval(): Res }).eval();
        const right = (b as { eval(): Res }).eval();
        return { val: left.val + right.val, msg: `${left.msg}+${right.msg}` };
    },
    AddExp_minus(a: unknown, _, b: unknown): Res {
        const left = (a as { eval(): Res }).eval();
        const right = (b as { eval(): Res }).eval();
        return { val: left.val - right.val, msg: `${left.msg}-${right.msg}` };
    },
    MulExp_times(a: unknown, _, b: unknown): Res {
        const left = (a as { eval(): Res }).eval();
        const right = (b as { eval(): Res }).eval();
        return { val: left.val * right.val, msg: `${left.msg}*${right.msg}` };
    },
    MulExp_divide(a: unknown, _, b: unknown): Res {
        const dividend = (a as { eval(): Res }).eval();
        const divisor = (b as { eval(): Res }).eval();
        return { val: dividend.val / divisor.val, msg: `${dividend.msg}÷${divisor.msg}` };
    },
    ExpExp_power(a: unknown, _, b: unknown): Res {
        const base = (a as { eval(): Res }).eval();
        const exp = (b as { eval(): Res }).eval();
        return { val: base.val ** exp.val, msg: `${base.msg}^${exp.msg}` };
    },
    PriExp_paren(_, a: unknown, __): Res {
        const res = (a as { eval(): Res }).eval();
        return { val: res.val, msg: `(${res.msg})` };
    },
    PriExp_pos(_, a: unknown): Res {
        const res = (a as { eval(): Res }).eval();
        return { val: Math.abs(res.val), msg: `abs(${res.msg})` };
    },
    PriExp_neg(_, a: unknown): Res {
        const res = (a as { eval(): Res }).eval();
        return { val: -res.val, msg: `-(${res.msg})` };
    },
});

const matchResult = diceGrammar.match("1 + 2 + ((4d3 / 3d1) ^ 3) - 4 * -3 / 2");
const adapter = sem(matchResult);
const res: Res = (adapter.eval as () => Res)();
console.log(res.msg);
console.log(res.val);
