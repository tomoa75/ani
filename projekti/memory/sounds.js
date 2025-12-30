const synth = new Tone.PolySynth(Tone.Synth, {
          volume: -8,
          
        }).toDestination();


function svirajlj (){ 
    const now = Tone.now();
        synth.triggerAttackRelease("c4", 0.1, now);
        synth.triggerAttackRelease("d4", 0.1, now + 0.1);
        synth.triggerAttackRelease("e4", 0.2, now + 0.2);
        synth.triggerAttackRelease("f4", 0.1,now +0.4 );
        synth.triggerAttackRelease("g4", 0.1, now + 0.5);
        synth.triggerAttackRelease("a4", 0.2, now + 0.6);
}
function svirajtuzno (){ 
    const now = Tone.now();
        synth.triggerAttackRelease("c4", 0.1, now);
        synth.triggerAttackRelease("b3", 0.1, now + 0.1);
        synth.triggerAttackRelease("a3", 0.2, now + 0.2);
        synth.triggerAttackRelease("g3", 0.1,now +0.4 );
        synth.triggerAttackRelease("e3", 0.1, now + 0.5);
        synth.triggerAttackRelease("c3", 0.2, now + 0.6);
}
function svirajfail (){ 
    const now = Tone.now();
        synth.triggerAttackRelease("c4", 0.2, now);
        synth.triggerAttackRelease("b3", 0.2, now + 0.2);
        synth.triggerAttackRelease("a3", 0.2, now + 0.4);
}

function svirajpogodak (){ 
    const now = Tone.now();
        synth.triggerAttackRelease("c4", 0.1, now);
        synth.triggerAttackRelease("e4", 0.1, now + 0.2);
        synth.triggerAttackRelease("g4", 0.1, now + 0.4);
        synth.triggerAttackRelease("c5", 0.1,now +0.6 );
      
}

function atariWin() {
    const now = Tone.now();

    synth.triggerAttackRelease("c5", 0.08, now);
    synth.triggerAttackRelease("e5", 0.08, now + 0.08);
    synth.triggerAttackRelease("g5", 0.08, now + 0.16);
    synth.triggerAttackRelease("c6", 0.12, now + 0.24);
    synth.triggerAttackRelease("g5", 0.12, now + 0.36);
    synth.triggerAttackRelease("c6", 0.16, now + 0.48);
}