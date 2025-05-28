#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
(0, utils_1.searchStocks)('同花顺').then(code => {
    console.log('searchStocks===>', code);
});
// 创建MCP服务器
// const server = new McpServer({
//   name: "ashare-query",
//   version: "1.0.0"
// });
// // // Add an addition tool
// server.tool("get_ticker_price",
//   { 
//     code: z.string(),
//   },
//   async ({ code }) => ({
//     content: [{ type: "text", text: code }]
//   })
// );
//# sourceMappingURL=index.js.map