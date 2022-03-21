const axios = require("axios");

class DangerU {
    constructor() {
        this.url = "https://dangeru.us";
        this.api = `${this.url}/api/v2`;

        this.color = "#f22e53";
        this.colorSecondary = "#72bfb1";

        // The API does not return the board names
        this.boardNames = {
            a: "Anime & Manga",
            burg: "Burg",
            cyb: "Cyberpunk Life",
            d: "Doujin",
            lain: "Cyberpunk",
            mu: "Music",
            new: "News & Politics",
            tech: "Technology",
            test: "Awoo testing grounds",
            u: "Random",
            v: "Video Games",
            all: "all",
        }
    }

    /**
     * Make a GET request to the API
     * @param {String} path - API path
     * @returns String[]
     */
    async fetch(path) {
        return await axios.get(this.api + path)
            .catch(console.error)
    }

    /**
     * Retrieve a JSON array with the board names
     * @returns String[]
     */
    boardList() {
        return this.fetch("/boards")
            .then((response) => response.data);
    }

    /**
     * Returns an array of threads from the specified board
     * @param {String} boardName
     * @returns Object[]
     */
    board(boardName) {
        return this.fetch(`/board/${boardName}`)
            .then((response) => response.data);
    }
}

module.exports = DangerU;