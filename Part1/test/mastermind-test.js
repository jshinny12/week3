const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;
const buildPoseidon = require("circomlibjs").buildPoseidon;


const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("mastermind unit tests", function () {
    this.timeout(100000000);

    it("normal test", async () => {

        let poseidon = await buildPoseidon();
        F = poseidon.F; 

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const res = poseidon([0]);
        //console.log(F.toObject(res));
        const INPUT = {
            oneAns: "1",
            twoAns: "2",
            threeAns: "3",
            fourAns: "4",
            same: "4",
            mixed: "0",
            publicSalt: F.toObject(res),
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            privateSalt: "0"
        }

        const witness = await circuit.calculateWitness(INPUT, true);
        
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        
        await circuit.assertOut(witness, {
            solnHashOut: F.toObject(res),
        });
        

        
    });

    it ("failing inputs double input", async() => {
        let poseidon = await buildPoseidon();
        F = poseidon.F; 

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const res = poseidon([0]);
        //console.log(F.toObject(res));
        const INPUT = {
            oneAns: "1",
            twoAns: "1",
            threeAns: "3",
            fourAns: "4",
            same: "4",
            mixed: "0",
            publicSalt: F.toObject(res),
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            privateSalt: "0"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
            assert(false, "invalid");
        } catch(err) {
            assert(err.message.includes("Assert Failed"));
        }
    });

    it ("failing inputs input out bounds", async() => {
        let poseidon = await buildPoseidon();
        F = poseidon.F; 

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const res = poseidon([0]);
        //console.log(F.toObject(res));
        const INPUT = {
            oneAns: "6",
            twoAns: "1",
            threeAns: "3",
            fourAns: "4",
            same: "4",
            mixed: "0",
            publicSalt: F.toObject(res),
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            privateSalt: "0"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
            assert(false, "invalid");
        } catch(err) {
            assert(err.message.includes("Assert Failed"));
        }
    });

    it ("failing inputs input out bounds2", async() => {
        let poseidon = await buildPoseidon();
        F = poseidon.F; 

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const res = poseidon([0]);
        //console.log(F.toObject(res));
        const INPUT = {
            oneAns: "0",
            twoAns: "1",
            threeAns: "3",
            fourAns: "4",
            same: "4",
            mixed: "0",
            publicSalt: F.toObject(res),
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            privateSalt: "0"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
            assert(false, "invalid");
        } catch(err) {
            assert(err.message.includes("Assert Failed"));
        }
    });

    it ("failing inputs input diff same", async() => {
        let poseidon = await buildPoseidon();
        F = poseidon.F; 

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const res = poseidon([0]);
        //console.log(F.toObject(res));
        const INPUT = {
            oneAns: "1",
            twoAns: "2",
            threeAns: "3",
            fourAns: "4",
            same: "3",
            mixed: "0",
            publicSalt: F.toObject(res),
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            privateSalt: "0"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
            assert(false, "invalid");
        } catch(err) {
            assert(err.message.includes("Assert Failed"));
        }
    });

    it ("failing inputs input diff mixed", async() => {
        let poseidon = await buildPoseidon();
        F = poseidon.F; 

        const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
        const res = poseidon([0]);
        //console.log(F.toObject(res));
        const INPUT = {
            oneAns: "1",
            twoAns: "2",
            threeAns: "3",
            fourAns: "4",
            same: "4",
            mixed: "1",
            publicSalt: F.toObject(res),
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            privateSalt: "0"
        }

        try {
            await circuit.calculateWitness(INPUT, true);
            assert(false, "invalid");
        } catch(err) {
            assert(err.message.includes("Assert Failed"));
        }
    });


});