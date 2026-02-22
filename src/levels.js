import { Phases } from './game/scenes/Level.js'

export const levels = {
    golden: {
        song: "Golden (Kpop Demon Hunters)",
        phase: Phases.CUTE,
        audio: "/golden.mp3",
        phase: "cute",
        level: "medium",
        start: 43,
        end: 67,
        beats: [47.095,47.564,48.084,48.512,48.995,49.495,50.012,50.477,50.991,51.428,51.928,52.395,52.74,53.028,54.4,54.9,55.4,55.867,56.332,56.817,57.315,57.833,58.328,58.844,59.249,59.779,61.634,62.113,62.368,62.61,63.18,63.674,63.957,64.127,64.464,64.662,65.094,65.593,65.763,65.946,66.147,66.309,66.474,66.666,66.929,67.609,67.777,67.945,68.125,68.293,68.662],
        holdBeats: {
            53.028: 0.7,
            59.779: 1.5,
            68.293: 0.1,
            68.662: 0.1
        },
        lyrics: [
            { t: 47.0,  text: "I'm done hidin', now I'm shinin'" },
            { t: 50.5,  text: "Like I'm born to be" },
            { t: 54.0,  text: "We dreamin' hard, we came so far" },
            { t: 58.0,  text: "Now I believe" },
            { t: 61.25,  text: "We're goin' up, up, up, it's our moment" },
            { t: 65,  text: "You know together we're glowin'" },
            { t: 67,  text: "Gonna be, gonna be golden" }
        ]
    },
    partyintheusa:{
        song: "Party in the USA (Miley Cyrus)",
        phase: Phases.CUTE,
        audio: "/partyintheusa.mp3",
        phase: "cute",
        level: "hard",
        start: 6,
        end: 30,
        beats: [10.227,10.577,10.734,10.887,11.21,11.495,11.647,11.993,12.43,12.582,12.737,13.079,13.237,13.404,13.715,13.888,15.282,15.523,15.736,15.907,16.194,16.498,16.653,16.943,18.061,18.234,18.402,18.686,19.003,20.2,20.585,20.733,20.872,21.191,21.332,21.501,21.786,21.94,22.09,22.421,22.945,23.088,23.24,23.372,23.694,23.852,24.025,24.187,24.326,24.501,24.66,24.959,25.449,25.718,25.872,26.18,26.5,26.941,27.778,27.945,28.077,28.254,28.416,28.641,28.989,29.426],
        holdBeats: {
            13.888: 0.3,
            19.003: 0.3,
            22.421: 0.2,
            24.959: 0.2, 
            26.5: 0.2,
            26.941:0.2,
            28.989: 0.2,
            29.426: 0.2
        },
        lyrics: [
            { t: 10,  text: "I hopped off the plane at LAX" },
            { t: 12,  text: "With a dream and a cardigan" },
            { t: 15,  text: "Welcome to the land of fame excess" },
            { t: 18, text: "Am I gonna fit in?" },
            { t: 20, text: "Jumped in the cab, here I am for the first time"},
            { t: 23, text: "Look to my right and I see the Hollywood sign" },
            { t: 25, text: "This is all so crazy" },
            { t: 27, text: "Everybody seems so famous" }
        ]
    },
    myheartwillgoon: {
        song: "My Heart Will Go On (Celine Dion)",
        audio: "/myheartwillgoon.mp3",
        phase: "cute",
        level: "easy",
        start: 200,
        end: 245,
        beats: [205.395,207.78,209.519,210.216,211.401,211.904,212.436,213.8,214.404,214.996,216.3,216.832,217.382,218.317,219.218,219.952,224.666,227.026,229.36,229.678,230.732,231.339,231.82,233.195,233.726,234.397,235.636,236.146,236.78,237.467,238.67,239.285,239.82,241.052,241.706,243.314,244.166],
        holdBeats: {
            205.395: 1.5,
            207.78: 1,
            210.216: 1,
            212.436: 0.5,
            214.996: 0.5,
            217.382: 0.5,
            218.317: 0.5,
            219.952: 1.5,
            221:1,
            224.666: 1.5,
            227.026: 1,
            229.678:1,
            231.82:1,
            234.397:1,
            237.467:1,
            239.82:1,
            241.706:1,
            244.166:1
        },
        lyrics: [
            {t: 200, text: "You're here, "},
            {t: 209, text: "There's nothing I fear"},
            {t:213, text: "And I know that my heart will go on"},
            {t: 223, text: "We'll stay"},
            {t: 229, text: "Forever this way"},
            {t: 233, text: "You are safe in my heart and"},
            {t: 238, text: "My heart will go on and on"}
        ]
    },
    hangingtree: {
        song: "The Hanging Tree (Jennifer Lawrence)",
        audio: "/hangingtree.mp3",
        phase: "creepy",
        level: "???",
        start: 81.5,
        end: 100,
        beats: [85.886,86.152,87.081,87.431,88.522,88.721,89.063,89.322,89.636,90.457,90.764,91.383,91.686,92,92.827,93.22,93.754,94.049,94.367,95.66,96.194,96.487,96.848,97.154,97.483,97.79,98.117,98.407,98.695,98.984,99.303,100.192,100.524,101.224,101.662,102.465,102.854,103.152,103.438,103.68,103.97],
        holdBeats: {
            86.152:0.5,
            87.431:0.5, 
            89.322: 0.25,
            90.764: 0.25,
            92: 0.25,
            93.22: 0.25,
            94.367: 0.5
        }, 
        lyrics: [

        ]
    }
};