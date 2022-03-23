const axios = require("axios");

class DangerU {
    constructor() {
        this.url = "https://dangeru.us";
        this.api = `${this.url}/api/v2`;

        this.color = "#f22e53";
        this.colorSecondary = "#72bfb1";

        this.thumbnails = {
            default: "https://i.imgur.com/aWS6tJ2.png",
            burg: "https://i.imgur.com/SCGM4yz.png",
            angryBurg: "https://i.imgur.com/nEnvL9d.png",
        }

        // The API does not include this data
        this.boardData = require("../data/dangeru_board_data.json");
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
    board(boardName, pageNumber) {
        return this.fetch(`/board/${boardName}?page=${pageNumber}`)
            .then((response) => response.data);
    }

    /**
     * Returns an array of the replies to the specified thread
     * @param {Number} threadId
     * @returns Object[]
     */
    thread(threadId) {
        return this.fetch(`/thread/${threadId}/replies`)
            .then((response) => response.data);
    }
}

module.exports = DangerU;