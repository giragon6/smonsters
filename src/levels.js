import { Phases } from './game/scenes/Level.js'

export const levels = {
    // cute
    golden: {
        song: "Golden (Kpop Demon Hunters)",
        phase: Phases.CUTE,
        audio: "/golden.mp3",
        phase: "cute",
        level: "medium",
        start: 43,
        end: 67,
        maxMissed: 18,
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
        maxMissed: 27,
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
    beautyandabeat:{
        song: "Beauty and a Beat (Justin Bieber)",
        phase: Phases.CUTE,
        audio: "/beautyandabeat.mp3",
        phase: "cute",
        level: "hard",
        start: 130,
        end: 228,
        maxMissed: 30,
        beats: [134.948,135.481,138.732,139.169,140.68,140.846,141.081,141.536,141.978,142.436,142.98,143.16,144.451,144.594,144.838,145.28,145.75,146.236,146.784,146.964,147.597,147.861,148.047,148.334,150.652,150.795,151.021,151.598,151.981,152.318,152.609,152.751,152.896,153.067,153.2,153.348,153.545,153.853,154.482,154.801,155.381,155.738,156.322,156.598,156.735,156.885,157.031,157.188,157.585,158.186,158.549,159.162,159.519,160.131,160.279,160.404,160.553,160.696,160.85,161.003,161.348,162.014,162.344,162.955,163.298,163.591,163.751,163.898,164.045,164.183,164.343,164.482,164.635,164.776,165.116],
        holdBeats:{
            135.481:2,
            139.169: 1,
            143.16: 1
        },
        lyrics:[
            {t: 135, text:"It's all 'bout you"},
            {t: 140, text: "When the music makes you move"},
            {t: 144, text: "Baby, do it like you do"},
            {t: 150, text: "In time, ink lines, b*** couldn't get on my incline"},
            {t: 154, text: "World tours, it's mine, ten little letters on a big sign"},
            {t: 158, text: "Justin Beiber, you know imma hit 'em the ether"},
            {t: 161.5, text: "Buns out, weiner but I gotta keep an eye out for Selener"}
        ]
    },

    // eerie
    hangingtree: {
        song: "The Hanging Tree (Jennifer Lawrence)",
        audio: "/hangingtree.mp3",
        phase: "eerie",
        level: "medium",
        start: 81.5,
        end: 100,
        maxMissed: 10,
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
            {t: 80, text: "Are you, are you"},
            {t: 88, text: "Coming to the tree?"},
            {t: 90, text: "I told you to run"},
            {t: 92.5, text: "So we'd both be free"},
            {t: 95, text: "Strange things did happen here"},
            {t: 98, text: "No stranger would it be"},
            {t: 100, text: "If we met at midnight in the hanging tree"}
        ]
    },
    myheartwillgoon: {
        song: "My Heart Will Go On (Celine Dion)",
        audio: "/myheartwillgoon.mp3",
        phase: "eerie",
        phase: Phases.EERIE,
        level: "easy",
        maxMissed: 9,
        start: 200,
        end: 245,
        beats: [205.395,207.78,209.519,210.216,211.401,211.904,212.436,213.8,214.404,214.996,216.3,216.832,217.382,218.317,219.218,219.952,224.666,227.026,229.36,229.678,230.732,231.339,231.82,233.195,233.726,234.397,235.636,236.146,236.78,237.467,238.67,239.285,239.82,241.052,241.706,243.314,244.166],
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
    badguy:{
        song: "bad guy (Billie Eilish)",
        audio: "/badguy.mp3",
        phase: "eerie",
        phase: Phases.EERIE,
        level: "medium",
        maxMissed: 13,
        start:45, 
        end: 62,
        beats: [49.774,49.93,50.267,50.722,51.145,51.337,51.525,51.732,52.002,52.422,52.901,53.088,53.336,53.544,53.764,54.256,54.697,54.865,55.051,55.269,55.586,55.997,57.026,57.166,57.488,58.66,60.397],
        holdBeats: {
            57.488: 1
        },
        lyrics: [
            {t: 49, text:"I'm the bad type"},
            {t: 50.5, text: "Make your mama sad type"},
            {t:52, text:"Make your girlfriend mad type"},
            {t: 53.5, text: "Might seduce your dad type"},
            {t: 55, text: "I'm the bad guy, duh"}
        ]
    },

    // // creepy
    piano: {
        song: "Davy Jones (Disney's Pirates of the Caribbean)",
        audio: "/piano.mp3",
        phase: "creepy",
        level: "medium",
        start: 1,
        end: 30,
        beats: [5, 8, 13, 18, 20, 22, 23, 23.5, 24, 24.3, 24.5, 24.65, 24.75, 24.83, 24.9, 24.95, 25],
        holdBeats: {
            5: 2,
            8: 1.5,
            13: 1.5,
            18: 1,
            20: 0.75,
            22: 0.5,
            23: 0.4,
            23.5: 0.3,
            24: 0.2,
            24.3: 0.15,
            24.5: 0.1,
            24.65: 0.1,
            24.75: 0.1,
            24.83: 0.1,
            24.9: 0.1,
            24.95: 0.1,
            25: 3,  
        },
        lyrics:[]
    }
};