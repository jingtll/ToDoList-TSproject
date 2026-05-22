# ToDoList 后端 API 接口文档

- **Framework**: Koa.js + TypeScript
- **Database**: MongoDB (`mongodb://127.0.0.1:27017/todo-list`)
- **Port**: 3000
- **CORS**: 允许所有来源

---

## 响应格式（统一）

```json
{
  "status": 20000,   // 20000=成功, 20001=失败
  "data": <payload>,
  "message": "success" | "error"
}
```

---

## 数据模型

### Note（集合：`notes`）

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | string | 自动生成 |
| `content` | string | 笔记内容 |
| `dates` | string | 日期字符串 |

### Todo（集合：`todolists`）

| 字段 | 类型 | 说明 |
|------|------|------|
| `_id` | string | 自动生成 |
| `content` | string | 待办内容 |
| `isdone` | boolean | 是否完成 |

---

## Note 接口

| # | Method | Path | 参数 | Body | 说明 |
|---|--------|------|------|------|------|
| 1 | GET | `/note/content/:content` | `:content`（搜索关键词） | - | 按内容模糊搜索笔记 |
| 2 | GET | `/note/page/:page/:size` | `:page`（页码）, `:size`（每页条数） | - | 分页获取笔记列表 |
| 3 | GET | `/note/id/:id` | `:id`（ObjectId） | - | 根据 ID 获取单条笔记 |
| 4 | POST | `/note` | - | `{ content, dates }` | 新增笔记 |
| 5 | DELETE | `/note/:id` | `:id`（ObjectId） | - | 删除笔记 |
| 6 | PUT | `/note/:id` | `:id`（ObjectId） | `{ content, dates }` | 更新笔记 |

### 调用示例

```
GET    /note/content/关键词          → 搜索笔记
GET    /note/page/1/10              → 第1页，每页10条
GET    /note/id/60f7c2d5e1382a2b8c0a1234  → 获取单条
POST   /note                        → body: { "content": "你好", "dates": "2026年5月22日" }
DELETE /note/60f7c2d5e1382a2b8c0a1234
PUT    /note/60f7c2d5e1382a2b8c0a1234  → body: { "content": "新内容", "dates": "2026年5月22日" }
```

---

## Todo 接口

| # | Method | Path | 参数 | Body | 说明 |
|---|--------|------|------|------|------|
| 1 | GET | `/todo/content/:content` | `:content`（搜索关键词） | - | 按内容模糊搜索待办 |
| 2 | GET | `/todo/page/:page/:size` | `:page`（页码）, `:size`（每页条数） | - | 分页获取待办列表 |
| 3 | POST | `/todo` | - | `{ content, isdone }` | 新增待办 |
| 4 | DELETE | `/todo/:id` | `:id`（ObjectId） | - | 删除待办 |
| 5 | PUT | `/todo/:id` | `:id`（ObjectId） | `{ content, isdone }` | 更新待办 |

### 调用示例

```
GET    /todo/content/买菜            → 搜索待办
GET    /todo/page/1/10              → 第1页，每页10条
POST   /todo                        → body: { "content": "买菜", "isdone": false }
DELETE /todo/60f7c2d5e1382a2b8c0a5678
PUT    /todo/60f7c2d5e1382a2b8c0a5678  → body: { "content": "买菜", "isdone": true }
```

---

## 已知 Bug

| # | 问题 | 位置 | 说明 |
|---|------|------|------|
| 1 | Todo 搜索路由写错 | `todoController.ts` | `GET /note/:content` 应为 `GET /todo/:content`，与 Note 路由冲突 |
| 2 | 新增 Todo 无返回值 | `todoDao.ts` addTodo 方法 | `const data` 未 return，`POST /todo` 永远返回失败 |
| 3 | catcherror 中间件未使用 | `utils/catcherror.ts` | 已定义但未在 index.ts 中引入 |
