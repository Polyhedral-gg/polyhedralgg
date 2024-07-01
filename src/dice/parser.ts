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
sem.addOperation("diceOp", {
    number(_): Res {
        return { val: parseInt(this.sourceString), msg: this.sourceString };
    },
    diceResult(a, _, b): Res {
        return { val: 1, msg: `${a.diceOp().msg}d${b.diceOp().msg}` };
    },
    AddExp_plus(a, _, b): Res {
        return { val: a.diceOp().val + b.diceOp().val, msg: `${a.diceOp().msg} + ${b.diceOp().msg}` };
    },
    AddExp_minus(a, _, b): Res {
        return { val: a.diceOp().val - b.diceOp().val, msg: `${a.diceOp().msg} - ${b.diceOp().msg}` };
    },
    MulExp_times(a, _, b): Res {
        return { val: a.diceOp().val * b.diceOp().val, msg: `${a.diceOp().msg} * ${b.diceOp().msg}` };
    },
    MulExp_divide(a, _, b): Res {
        return { val: a.diceOp().val * b.diceOp().val, msg: `${a.diceOp().msg} * ${b.diceOp().msg}` };
    },
    ExpExp_power(a, _, b): Res {
        return { val: a.diceOp().val ** b.diceOp().val, msg: `${a.diceOp().msg} ^ ${b.diceOp().msg}` };
    },
    PriExp_paren(_, a, __): Res {
        return { val: a.diceOp().val, msg: ` ( ${a.diceOp().msg} ) ` };
    },
    PriExp_pos(_, a): Res {
        return { val: Math.abs(a.diceOp().val), msg: ` abs(${a.diceOp().msg}) ` };
    },
    PriExp_neg(_, a): Res {
        return { val: -a.diceOp().val, msg: ` -(${a.diceOp().msg}) ` };
    },
});

// console.log(diceGrammar);
const matchResult = diceGrammar.match("1 + 2 + 4d3 / 3d1 ^ 3");
// console.log(matchResult.succeeded());
const adapter = sem(matchResult);
const res = adapter.diceOp();
console.log(res.msg);
console.log(res.val);
