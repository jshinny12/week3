pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";


// [assignment] implement a variation of mastermind from https://en.wikipedia.org/wiki/Mastermind_(board_game)#Variation as a circuit
// implements number mastermind --> can be digits 0-5 for 4 inputs 
template MastermindVariation() {
    //inputs
    signal input oneAns; 
    signal input twoAns; 
    signal input threeAns; 
    signal input fourAns; 

    signal input same; 
    signal input mixed;

    signal input publicSalt;
    
    // answers and salt
    signal input one; 
    signal input two; 
    signal input three; 
    signal input four; 
    
    signal input privateSalt;

    //output hash
    signal output solnHashOut;

    // check if digits are all 0-5 for inputs 
    var guess[4] = [oneAns, twoAns, threeAns, fourAns];
    var soln[4] =  [one, two, three, four];
    var checkedGuess[4] = [0, 0, 0, 0];
    var checkedSoln[4] = [0, 0, 0, 0];
    var trueSame = 0; 
    var trueSwitch = 0;
    
    var i = 0;
    var j = 0;

    component lessthan[8];
    component greaterthan[8];
    component isEqual[12];
    component eq[16];

    var lessIndex = 0; 


    // all values are unique constraints
    for (i = 0; i < 4; i++) {
        for (j = i + 1; j < 4; j++) {
            isEqual[lessIndex] = IsEqual(); 
            isEqual[lessIndex].in[0] <== guess[i];
            isEqual[lessIndex].in[1] <== guess[j];
            isEqual[lessIndex].out === 0;
            isEqual[lessIndex + 1] = IsEqual(); 
            isEqual[lessIndex + 1].in[0] <== soln[i];
            isEqual[lessIndex + 1].in[1] <== soln[j];
            isEqual[lessIndex + 1].out === 0;
            lessIndex += 2;
            
        }
    }


    lessIndex = 0;
    // checks that it's in the correct range using constraints
    for (i = 0; i < 4; i++) {
        lessthan[lessIndex] = LessThan(3);
        lessthan[lessIndex + 1] = LessThan(3);
        lessthan[lessIndex].in[0] <== guess[i];
        lessthan[lessIndex + 1].in[0] <== soln[i];
        lessthan[lessIndex].in[1] <== 6;
        lessthan[lessIndex + 1].in[1] <== 6;
        lessthan[lessIndex].out === 1;
        lessthan[lessIndex + 1].out === 1;


        greaterthan[lessIndex] = GreaterThan(3);
        greaterthan[lessIndex + 1] = GreaterThan(3);
        greaterthan[lessIndex].in[0] <== guess[i];
        greaterthan[lessIndex + 1].in[0] <== soln[i];
        greaterthan[lessIndex].in[1] <== -1;
        greaterthan[lessIndex + 1].in[1] <== -1;
        greaterthan[lessIndex].out === 1;
        greaterthan[lessIndex + 1].out === 1;

        lessIndex += 2;
    }

    //calculate how many digits line up
    lessIndex = 0;
    for (i = 0; i < 4; i++) {
        eq[lessIndex] = IsEqual();
        eq[lessIndex].in[0] <== guess[i];
        eq[lessIndex].in[1] <== soln[i];
        trueSame += eq[lessIndex].out * 1;
        checkedGuess[i] += eq[lessIndex].out * 1;
        checkedSoln[i] += eq[lessIndex].out * 1;
        lessIndex++;
    }

    //calculate how many digits are mixed around
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (i != j) {
                eq[lessIndex] = IsEqual();
                eq[lessIndex].in[0] <== guess[i];
                eq[lessIndex].in[1] <== soln[j];
                trueSwitch += eq[lessIndex].out * 1;
                checkedGuess[i] += eq[lessIndex].out * 1;
                checkedSoln[j] += eq[lessIndex].out * 1;
                lessIndex++;
            }
        }
    }


    //make constraints on the number of same and switched
    component equalToSame = IsEqual();
    equalToSame.in[0] <== trueSame;
    equalToSame.in[1] <== same;
    equalToSame.out === 1;

    component equalToSwitch = IsEqual();
    equalToSwitch.in[0] <== trueSwitch;
    equalToSwitch.in[1] <== mixed;
    equalToSwitch.out === 1;

    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== privateSalt;

    solnHashOut <== poseidon.out;
    publicSalt === solnHashOut;

}

component main = MastermindVariation();