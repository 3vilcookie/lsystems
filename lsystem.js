/*
 * @file:       lsystem.js
 * @brief:      Another Lsystem Class which can create Turtle-Graphics-Printable output 
 * @author:     Raphael Pour <turtle@raphaelpour.de>
 * @license:    (C) 2018 Raphael Pour LGPL
 */

// TODO: Outsource String parsing to Vue App, since it isn't the problem of the LSystem which format the UI Input has

class LSystem {

    constructor() {
        this.n = 1;
    }

    isTerminalsymbol(value) {
        if (this._E)
            return this._E.indexOf(value) != -1;
        else
            return false;
    }

    isVariable(value) {
        if (this._V)
            return this._V.indexOf(value) != -1;
        else
            return false;
    }

    set P(value) {

        var rules = value.split("\n");

        var tempRules = [];
        var i;
        var j;
        var premise;
        var conclusion;
        var rule;

        for (i = 0; i < rules.length; i++) {
            rule = rules[i].split("=");
            if (rule.length != 2)
                throw "Syntax Error with Rule '" + rules[i] + "'";

            premise = rule[0].trim();
            conclusion = rule[1].trim();

            // Check premise
            if (premise.length != 1)
                throw "Syntax Error with Rule '" + rules[i] + "'. Premise can only be one Symbol.";

            if (!this.isVariable(premise))
                throw "Syntax Error with Rule '" + rules[i] + "'. Premise must be a Variable";

            // Check conclusion
            if (conclusion.length == 0)
                throw "Syntax Error with Rule '" + rules[i] + "'. Conclusion must be at least one Symbol.";


            for (j = 0; j < conclusion.length; j++)
                if (!this.isTerminalsymbol(conclusion[j]) && !this.isVariable(conclusion[j]))
                    throw "Syntax Error with Rule '" + rules[i] + "' with Symbol '" + conclusion[j] + "'. Symbol must be a Variable or Terminalsymbol.";


            // Build up Rule infrastructure
            tempRules.push({ "premise": premise, "conclusion": conclusion });
        }

        this._P = tempRules;
    }

    get P() {
        var out = "";

        var i;
        for (i = 0; i < this._P.length; i++)
            out += this._P[i].premise + ":" + this._P[i].conclusion + "\n";

        return out;
    }

    set E(value) {

        if (this._V) {
            var i;
            for (i = 0; i < value.length; i++)
                if (this.isVariable(value[i]))
                    throw "Variables and Terminalsymbols can't share the same Symbol '" + value[i] + "'";

        }
        this._E = value.split("");
    }

    get E() {
        return this._E;
    }

    set V(value) {

        if (this._E) {
            var i;
            for (i = 0; i < value.length; i++)
                if (this.isTerminalsymbol(value[i]))
                    throw "Variables and Terminalsymbols can't share the same Symbol'" + value[i] + "'";
        }

        this._V = value.split('');
    }

    get V() {
        if (this._V)
            return this._V.join('');
        else
            return "";
    }

    set Axiom(value) {
        var i;
        for (i = 0; i < value.length; i++)
            if (!this.isVariable(value[i]) && !this.isTerminalsymbol(value[i]))
                throw "Axiom can only consist of Variables and Terminalsymbols";

        this._Axiom = value;
    }

    get Axiom() {
        return this._Axiom;
    }

    generate() {
        var i;
        var k;
        var s;
        var r;
        var currentRule;
        var input = this.Axiom;
        var output;

        // Check if values are set 
        if (!this._V || this._V.length == 0)
            throw "Please add at least one Variable. For example F or FG or XYZ";

        if (!this._Axiom || this._Axiom.length == 0)
            throw "Please add an Axiom (Start value). For example FG";

        if (!this._P || this._P.length == 0)
            throw "Please add at least one rule. For example F=F-F or G=F+G";

        // Every iteration is a new generation
        for (k = 0; k < this.n; k++) {
            output = "";

            // Go throgh each single char and try to replace it
            for (i = 0; i < input.length; i++) {
                s = input[i];

                if (this.isVariable(s)) 
                    // Find rule for this variable and replace it
                    for (r = 0; r < this._P.length; r++) {
                        currentRule = this._P[r];
                        
                        if(currentRule.premise == s)
                        {
                            output += currentRule.conclusion;
                            break;
                        }
                    }
                else if (this.isTerminalsymbol(s))
                    output += s;
                else
                    throw "Unknwon symbol '" + s + "' @ Position " + i;
            }
            input = output;
        }
        console.log(output);
        this.out = output;
    }
}