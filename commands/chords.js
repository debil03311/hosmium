const chordSymbolMap = {
    // 
}

module.exports = {
    description: "Generate audio from chord progressions.",
    deepHelp: [
        "The default tempo is <:quarternote:956343430747918346> = 120bpm",
        "You can mix and match chord symbol styles as long as they make sense.",
    ],
    aliases: [
        "chord",
        "chordprog",
        "progression",
    ],
    arguments: [
        "tempo?",
        "...chordSymbols"
    ],
    usage: [
        "`chords` `Bbmajmin7`",
        "`chords` `F E Am C`",
        "`chords` `120` `2:F 2:E 2:Am 2:C 4:F`",
        "`chords` `144` `2:FM7 2:E7b13 1:Am7 1:Abm7 1:Gm7 1:C7`",
        "`chords` `2:Fmaj7 2:E7b13 1:A-7 1:Ab-7 1:G-7 1:C7 4:F`",
        "`chords` `90` `FM7 E7 Am7 Ab-7 Gmin7 C7`",
        "etc."
    ],

    hidden: true,

    execute({ message } = {}) {
        // 

        message.reply({
            content: "test",
            embeds: [],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}