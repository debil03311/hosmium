const mdSymbols = {
  italic: "*",
  bold: "**",
  underline: "__",
  code: "`",
  codeBlock: "```",
  spoiler: "||",
}

module.exports = {
  /**
   * Get the current time
   * @returns `String` HH:MM:SS
   */
  timestamp() {
    return new Date().toLocaleTimeString();
  },

  /**
   * Capitalize a string of text
   * @param { String } text 
   * @returns `String` Capitalized input
   */
  capitalize(text) {
    if (typeof text !== "string")
      return text;

    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /**
   * Shortens a string by replacing its middle part.
   * @param { String } text - Original string
   * @param { Number } maxVisible - Amount of characters visible at the start and end of the string
   * @param { String } filler - Middle part of the string gets replaced with this
   * @returns some example text => some...text
   */
  shortenText(text, maxVisible=4, filler="...") {
    // If the text is too short, don't bother
    if (maxVisible > text.length - (maxVisible * 2))
      return text;

    const textStart = text.slice(0, maxVisible);
    const textEnd = text.slice(text.length - maxVisible, text.length);

    return textStart + filler + textEnd;
  },

  /**
   * Creates an object to be passed to a slash command's
   * option's .addChoices() method
   * @param { String } choiceName 
   * @returns `Object`
   */
  toChoiceObject(choiceName) {
    return ({
      name: choiceName,
      value: choiceName,
    });
  },

  /**
   * Wrap a string of text with another
   * @param { String } text 
   * @param { String } wrap 
   * @returns `String`
   */
  wrapText(text, wrap) {
    return wrap + text + wrap;
  }
}