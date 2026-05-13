import type { Persona, PersonaKey } from "./types";

export const PERSONAS: Record<PersonaKey, Persona> = {
  dreamer: {
    name: "The Dreamer",
    color: "#c77dff",
    desc: "You came for the goosebumps, not the BPM. You want chords that build for eight minutes and views worth crying at.",
    tags: ["Melodic", "Emotional", "Sunset sets"],
    matches: ["arodes","kilimanjaro","mind-against","adriatique","lane8","monolink","parra","ben-bohmer","yotto","weval","thylacine","nimino"],
  },
  voyager: {
    name: "The Voyager",
    color: "#00d4ff",
    desc: "You're here for the journey — long, hypnotic sets that take their time. You'll skip the bangers if the storytelling is good.",
    tags: ["Hypnotic", "Story-driven", "Live electronica"],
    matches: ["acid-pauli","berlioz","rodrigo-gallardo","weval","parra","nimino","royksopp","thylacine","ame-sama","kerri-chandler"],
  },
  raver: {
    name: "The Raver",
    color: "#ff2d55",
    desc: "Hard kicks. Fast tempos. Eyes closed, hands up. You came to sweat and you don't want to come down.",
    tags: ["Techno", "Fast tempo", "Peak time"],
    matches: ["anna","anfisa-letyago","funk-tribu","anetha","michael-bibi","mind-against","eric-prydz","aaron-hibell"],
  },
  fluidic: {
    name: "The Fluidic",
    color: "#ff7eb3",
    desc: "You live for the lift — the synth lead climbing over the build, the chord that stretches across the room, the hands-up moment when the track finally breaks open.",
    tags: ["Anthemic", "Soaring", "Mainstage"],
    matches: ["artbat","kasablanca","kolsch","ben-bohmer","vintage-culture","jimi-jules","aaron-hibell","miss-monique","eric-prydz"],
  },
  groover: {
    name: "The Groover",
    color: "#ffd60a",
    desc: "You came to dance. Not to vibe out, not to cry — to dance. Funk, bounce, swing, and a perfect kick drum.",
    tags: ["House", "Funky", "Dancefloor"],
    matches: ["kerri-chandler","etienne","sammy-virji","lp-dj-tennis","michael-bibi","carlita","jimi-jules","meera","mahmut-orhan","kilimanjaro"],
  },
  wanderer: {
    name: "The Wanderer",
    color: "#84d63c",
    desc: "Earth tones, ethnic instruments, drums you can feel in your chest. You belong by the trees, not the speakers.",
    tags: ["Organic", "Earthy", "Daytime"],
    matches: ["carlita","arodes","enfant-sauvage","rodrigo-gallardo","monolink","deer-jade","mahmut-orhan","ame-sama","ginton","meera"],
  },
};

