# mcp-server-demo
写一个mcp服务


python 运行

```

cd py

// 开发
uvicorn main:app --reload   

// 生产
uvicorn main:app

// pip install "uvicorn[standard]"
// uvicorn main:app --host '0.0.0.0' --port 8800 --reload

```

### 资料
* demo1：https://github.com/MCP-100/stock-market-server/blob/main/src/index.ts