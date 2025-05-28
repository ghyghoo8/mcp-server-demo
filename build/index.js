#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const utils_1 = require("./utils");
const minSchema = zod_1.z.enum(['1m', '5m', '15m', '30m', '60m']);
const daySchema = zod_1.z.enum(['1d', '1w', '1M']);
// 创建MCP服务器
const server = new mcp_js_1.McpServer({
    name: "ashare-query",
    version: "1.0.0"
});
server.resource("stock-code", new mcp_js_1.ResourceTemplate("file:///libs/codeData.json", { list: undefined }), async (uri) => ({
    contents: [{ uri: uri.href, text: "all stock-code list data", mimeType: 'text/json' }],
}));
server.tool("get_stock_code", {
    name: zod_1.z.string()
}, async ({ name }) => {
    const code = await (0, utils_1.searchStocks)(name);
    return {
        content: [{ type: "text", text: code }]
    };
});
// Add an addition tool
server.tool("get_stock_price_min", {
    code: zod_1.z.string(),
    frequency: minSchema,
    count: zod_1.z.number().default(10),
}, async ({ code, frequency, count }) => {
    const data = await (0, utils_1.getStockPrice)(code, frequency, count);
    return {
        content: [{ type: "text", text: data }]
    };
});
server.tool("get_stock_price_day", {
    code: zod_1.z.string(),
    frequency: daySchema,
    count: zod_1.z.number().default(10),
    end_date: zod_1.z.optional(zod_1.z.string())
}, async ({ code, frequency, count, end_date }) => {
    const data = await (0, utils_1.getStockPrice)(code, frequency, count, end_date);
    return {
        content: [{ type: "text", text: data }]
    };
});
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport).then((v) => {
    console.log('mcp running', v);
});
// 关闭则退出
process.on('SIGINT', async () => {
    await server.close();
    console.log('mcp closed');
    process.exit(0);
});
//# sourceMappingURL=index.js.map