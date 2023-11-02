"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const node_cache_1 = __importDefault(require("node-cache"));
const app = (0, express_1.default)();
const API_KEY = 'f98362c3-d776-433d-9513-ff0546b60c2d';
const guardianBaseUrl = 'https://content.guardianapis.com';
// Create a cache with a 10-minute (600 seconds) validity
const cache = new node_cache_1.default({ stdTTL: 600 });
app.get('/api/:section', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const section = req.params.section;
    // Check if the data is already in the cache
    const cachedData = cache.get(section);
    if (cachedData) {
        // If data is found in the cache, serve it
        res.json(cachedData);
    }
    else {
        const rssUrl = `${guardianBaseUrl}/${section}?format=xml&api-key=${API_KEY}`;
        const response = yield axios_1.default.get(rssUrl);
        if (response.status !== 200) {
            res.status(response.status).json({ error: 'RSS feed request failed' });
            return;
        }
        (0, xml2js_1.parseString)(response.data, (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Error parsing RSS feed' });
            }
            else {
                // Cache the result with a 10-minute validity
                cache.set(section, result);
                res.json(result);
            }
        });
    }
}));
app.get("/api/async/:section", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            url: 'https://content.guardianapis.com/sections?${section}&api-key=f98362c3-d776-433d-9513-ff0546b60c2d',
            method: "get",
        });
        res.status(200).json(response.data);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
