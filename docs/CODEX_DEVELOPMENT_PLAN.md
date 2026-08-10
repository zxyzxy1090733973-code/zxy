# Codex 自动开发执行计划

> **用途**：交给 Codex 按阶段自动开发。  
> **当前阶段**：`S00_FOUNDATION`  
> **执行原则**：按“纵向切片”开发；每个业务阶段必须同时完成 Contract、后端、前端和测试。当前阶段未验收，不进入下一阶段。

---

## 1. 产品主流程

```text
上传 Artwork
→ AI 拆解 Parts
→ 人工审核 Parts
→ ReferenceImageVersion
→ MultiviewVersion(FRONT/LEFT/BACK)
→ Tripo 生成 ModelVersion(GLB)
→ ModelAnalysis
→ 浏览器 3D 预览
→ ModelReview
→ OBJ / FBX ModelExport
→ Signed Download URL
```

**唯一需求覆盖：取消“用户创建项目”。**

保留 `Project` 作为后端内部聚合容器，但：

- 不做 Project List / Create Project 页面。
- 不做 `POST /api/projects`。
- 不做 `CreateProjectUseCase`。
- `POST /api/artworks` 成功时，由后端内部自动创建 `Project + Artwork`。
- 用户入口直接是 Artwork 上传。

---

## 2. 总体开发流程

| 阶段 | 模块 | 后端核心 | 前端核心 | 主要产物 | 状态 |
|---|---|---|---|---|---|
| `S00` | Foundation | Domain / Contracts / API / Worker / DB / Storage / Queue 骨架 | App Shell / 路由 / API Client / 通用状态 | 可扩展工程骨架 | `IN_PROGRESS` |
| `S01` | Artwork Upload | 上传校验、私有存储、内部 Project | 上传页、预览、错误反馈 | `Artwork` | `NOT_STARTED` |
| `S02` | Artwork Decompose | Queue + OpenAI + Zod + 持久化 | 启动拆解、进度与失败重试 | `DecompositionRun + Part[]` | `NOT_STARTED` |
| `S03` | Part Review | Part 编辑、增删、批准门禁 | 拆解审核页 | Approved Parts | `NOT_STARTED` |
| `S04` | Reference Image | 独立 Job、转存、版本化 | 参考图版本列表、生成/切换 | `ReferenceImageVersion` | `NOT_STARTED` |
| `S05` | Multiview | FRONT/LEFT/BACK 同版本、批准 | 三视图预览/重生成/批准 | Approved `MultiviewVersion` | `NOT_STARTED` |
| `S06` | Model Generation | Tripo Task、轮询、幂等 | 发起生成、实时状态展示 | `ModelVersion` | `NOT_STARTED` |
| `S07` | Model Storage | 下载 GLB 到私有 Storage | 下载阶段状态展示 | Stored GLB | `NOT_STARTED` |
| `S08` | Model Analysis | 服务端解析 GLB、保存指标 | 分析状态和结果入口 | `ModelAnalysis` | `NOT_STARTED` |
| `S09` | Model Preview | 模型读取接口 | Three.js/R3F Viewer | Browser 3D Viewer | `NOT_STARTED` |
| `S10` | Model Review | Approve/Reject 版本级审核 | 模型审核 UI | `ModelReview` | `NOT_STARTED` |
| `S11` | Model Regeneration | 新 ModelVersion + 复用生成管线 | 修改要求、历史版本切换 | New `ModelVersion` | `NOT_STARTED` |
| `S12` | Model Export | OBJ/FBX 独立转换和验证 | 导出状态页 | `ModelExport` | `NOT_STARTED` |
| `S13` | Download | 后端资格门禁 + Signed URL | 下载按钮和过期处理 | Download URL | `NOT_STARTED` |
| `S14` | Reliability | 幂等/重试/超时/限流/安全 | 全局错误/Retry/任务状态体验 | 稳定运行规则 | `NOT_STARTED` |
| `S15` | E2E Release | 全链路自动化 | Playwright 浏览器主流程 | Release Candidate | `NOT_STARTED` |

---

## 3. Codex 执行规则

每次开始开发前读取：

```text
CODEX_DEVELOPMENT_PLAN.md
AGENTS.md
PRD.md
ACCEPTANCE_CRITERIA.md
```

若冲突：仅“取消用户创建项目”以本文件为准；其他架构、安全、技术栈要求以 `AGENTS.md` 为准。

### 3.1 阶段状态

只允许：

```text
NOT_STARTED
IN_PROGRESS
IMPLEMENTED_UNVERIFIED
DONE
BLOCKED
```

### 3.2 阶段完成条件

阶段只有同时满足以下条件才能标记 `DONE`：

- 本阶段子任务全部完成。
- Contract / Domain 类型同步。
- 后端路径可用。
- 本阶段 Web 页面或 UI 已接入应用自身的真实 Contract/API 链路，而不是前端静态假数据；外部 Provider 是否真实由第 3.4 节控制，默认仍为 Mock。
- Loading / Empty / Error / Retry 等必要 UI 状态完成。
- Runtime 不可信数据按要求经 Zod 校验。
- 必要单测/集成测试完成。
- 涉及用户流程时，至少有浏览器级验收；关键流程进入 Playwright。
- 环境可用时 `pnpm lint && pnpm typecheck && pnpm test && pnpm build` 通过。
- 若仍未安装依赖或无法运行验证，只能标记 `IMPLEMENTED_UNVERIFIED`。
- 本阶段每个子任务都满足第 3.5 节 Git 规则：独立分支、独立 Commit、已 Push GitHub；未完成 Push 的任务不能计入 `DONE`。

### 3.3 禁止跨阶段

Codex 不得因为“顺手”提前实现后续阶段。允许预留类型/目录，不允许提前实现真实 Provider、业务逻辑或 UI 流程。

### 3.4 Provider 调用安全规则（全局硬规则）

开发、自动化测试和 Codex 默认执行环境 **禁止产生 OpenAI / Tripo 等付费 Provider 请求**。实现真实 Adapter 不等于启用真实调用。

固定环境变量：

```env
PROVIDER_MODE=mock
ALLOW_PAID_PROVIDER_CALLS=false
```

允许值：

```text
PROVIDER_MODE=mock | real
ALLOW_PAID_PROVIDER_CALLS=false | true
```

真实 Provider 网络请求必须同时满足：

```text
PROVIDER_MODE=real
AND
ALLOW_PAID_PROVIDER_CALLS=true
```

任一条件不满足，都必须使用对应 `Mock*Provider`，或在错误配置时 fail fast；**API Key 是否存在绝不能作为启用真实 Provider 的判断条件**。

Codex 必须遵守：

1. `.env.example` 固定以 `PROVIDER_MODE=mock`、`ALLOW_PAID_PROVIDER_CALLS=false` 为默认值。
2. Codex 不得自行把任一开关改为真实付费模式；只有用户在当前任务中明确要求“开启真实 API 联调”才允许修改。
3. 即使本机已存在真实 `OPENAI_API_KEY` / `TRIPO_API_KEY`，Mock 模式也不得向 Provider 域名发送请求。
4. Vitest、Playwright、CI 默认强制 Mock；`pnpm test` / `pnpm test:e2e` 不得触发真实付费调用。
5. 真实 Provider 集成测试必须单独标记、单独命令执行，且默认跳过。
6. Mock 与 Real 必须实现同一个 Application Port，Web/API/Application 不允许为 Mock/Real 分叉两套业务逻辑。
7. Mock Provider 至少支持：成功、失败、超时、限流、无效响应；涉及异步任务时支持 queued/running/succeeded/failed 状态模拟。
8. 图片/GLB 等 Provider 产物在 Mock 模式使用本地 fixture 或测试对象存储资源，不得依赖真实 Provider 临时 URL。
9. 付费操作仍必须保留 `idempotencyKey`；进入 Real 模式后也不得因 Worker 重试重复付费提交。
10. 默认阶段验收报告中的 `Paid provider calls` 必须为 `0`。

推荐选择器：

```ts
// ✅ 正确：显式双开关才允许真实 Provider
const realProviderEnabled =
  config.providerMode === 'real' &&
  config.allowPaidProviderCalls === true;

const provider: ArtworkDecompositionProvider = realProviderEnabled
  ? new OpenAIArtworkDecompositionAdapter(...)
  : new MockArtworkDecompositionProvider(...);
```

```ts
// ❌ 反面：检测到 Key 就自动开始花费
const provider = process.env.OPENAI_API_KEY
  ? new OpenAIArtworkDecompositionAdapter(...)
  : new MockArtworkDecompositionProvider(...);
```

运行时必须再做保护：

```ts
// ✅ Real Adapter 在真正发请求前再校验一次
assertPaidProviderCallsAllowed(config);
```


### 3.5 Git 版本管理（全局硬规则）

**目标**：每个最小开发任务都有独立、可定位、可回滚的 Git 历史，并在进入下一任务前同步到 GitHub。

#### 3.5.1 任务粒度

本文中的“一个任务”指一个最小编号子任务，例如：

```text
S00.1
S00.2
S01.4
S06.7
```

**每个子任务必须使用独立分支。** 不得把多个无关子任务混在同一分支中，也不得直接在默认分支上开发。

#### 3.5.2 分支命名

固定格式：

```text
<type>/<short-description>
```

`short-description` 必须使用简短、清晰的英文 kebab-case，只描述本任务做了什么；避免阶段编号堆叠、完整句子和冗长描述。

允许的 `type` 只有：

| 前缀 | 用途 | 示例 |
|---|---|---|
| `feat/` | 新功能 | `feat/artwork-upload` |
| `fix/` | 修复 Bug | `fix/model-retry-idempotency` |
| `docs/` | 文档修改 | `docs/provider-safety-rules` |
| `test/` | 测试 | `test/model-approval` |
| `refactor/` | 不改变功能的重构 | `refactor/storage-adapter` |
| `chore/` | 初始化、配置、依赖更新 | `chore/monorepo-foundation` |

✅ 正确：

```text
chore/monorepo-foundation
feat/domain-statuses
feat/artwork-upload
fix/tripo-idempotency
test/download-eligibility
```

❌ 反面：

```text
feature/S00-1-create-the-whole-monorepo-foundation-and-configure-everything
my-branch
update
feat/artwork-upload-and-decomposition-and-review
```

#### 3.5.3 Commit 命名

Commit Message 与分支类型保持一致，固定格式：

```text
<type>: <short description>
```

其中 Commit 的 `type` 不带 `/`：

```text
feat: add artwork upload contract
fix: prevent duplicate model generation
chore: initialize monorepo workspace
```

一次 Commit 只对应当前任务，不混入无关重构、格式化或其他阶段代码。

#### 3.5.4 每个任务的固定 Git 流程

Codex 每执行一个最小子任务，必须严格按以下顺序：

```text
1. 确认当前任务编号和目标
2. 获取最新远端状态
3. 从最新已验收基线创建新分支
4. 只实现当前任务
5. 执行当前任务所需验收
6. 检查 git diff，确认没有无关改动、Secret 或本地运行数据
7. 创建 Commit
8. Push 当前分支到 GitHub（origin）
9. 记录 branch name + commit SHA + verification result
10. 当前任务验收成功后，按仓库策略合并到基线分支，再开始下一个任务
```

推荐命令形态：

```bash
git fetch origin
git switch <base-branch>
git pull --ff-only origin <base-branch>
git switch -c <type>/<short-description>

# 开发 + 验收

git status
git diff --check
git add <only-current-task-files>
git commit -m "<type>: <short description>"
git push -u origin <type>/<short-description>
```

`<base-branch>` 指仓库当前默认/已验收基线分支；不得在文档中硬编码不存在的 `main`、`master` 或 `develop`。

#### 3.5.5 合并与下一任务

- 当前任务**验收通过且已 Push**，才允许进入合并步骤。
- 若仓库允许直接合并，按现有仓库策略执行；若启用了 Branch Protection / Pull Request，则遵守其要求，不得绕过。
- 下一任务必须基于**最新已验收且已合并的基线**创建新分支。
- 若当前任务为 `IMPLEMENTED_UNVERIFIED`、`BLOCKED` 或验收失败，不得作为下一任务的新基线。
- 不得为了“继续开发”把失败代码强行合并到基线。

#### 3.5.6 回滚与历史保护

必须保证任意已验收任务都能通过 Commit SHA 精确定位和回滚。

禁止：

```text
直接在默认分支开发
force push / push --force
重写已共享历史
git reset --hard 用于覆盖已共享提交
把多个任务压成一个无法区分的巨大提交
任务完成后未 Push 就继续下一个任务
```

如需撤销已合并任务，优先使用新的 `git revert <commit>` 提交保留历史，而不是改写历史。

#### 3.5.7 GitHub 不可用时

若缺少 GitHub Remote、认证失败、网络不可用或 Branch Protection 阻止必要操作：

1. 可以完成当前任务的本地实现和本地 Commit；
2. 必须把 Git 状态标记为 `PUSH_BLOCKED`；
3. 必须报告本地 Branch 和 Commit SHA；
4. **不得声称该任务 Git 验收完成，也不得自动进入下一任务**。

#### 3.5.8 每任务固定 Git 记录

每完成一个子任务，Codex 必须至少输出：

```md
### Task Git Result

- Task: `Sxx.n`
- Branch: `<type>/<short-description>`
- Commit: `<full-or-short-sha>`
- Push: `PASS | PUSH_BLOCKED`
- Base branch: `<resolved-base-branch>`
- Verification: `PASS | IMPLEMENTED_UNVERIFIED | FAIL`
- Rollback point: `<commit-sha>`
```

---

## 4. 统一命名：后端与前端都必须复用

### 4.1 核心实体

| 业务概念 | 固定代码名 |
|---|---|
| 内部聚合 | `Project` |
| 原始概念图 | `Artwork` |
| AI 拆解版本 | `DecompositionRun` |
| 独立部件 | `Part` |
| 参考图版本 | `ReferenceImageVersion` |
| 三视图版本 | `MultiviewVersion` |
| 3D 模型版本 | `ModelVersion` |
| 模型分析 | `ModelAnalysis` |
| 模型审核 | `ModelReview` |
| 模型导出 | `ModelExport` |

### 4.2 ID

```text
projectId
artworkId
decompositionRunId
partId
referenceImageVersionId
multiviewVersionId
modelVersionId
modelAnalysisId
modelReviewId
modelExportId
jobId
providerTaskId
idempotencyKey
```

禁止 `modelId / generatedModelId / tripoModelId` 混用；业务侧统一使用 `modelVersionId`。

### 4.3 Contract

统一：

```text
<Action><Resource>RequestSchema
<Action><Resource>ResponseSchema
<Action><Resource>Request
<Action><Resource>Response
```

例如：

```text
UploadArtworkResponseSchema
UpdatePartRequestSchema
CreateModelReviewRequestSchema
CreateDownloadUrlResponseSchema
```

### 4.4 Use Case

同步操作：

```text
<Action><Resource>UseCase
```

异步操作：

```text
Start<Operation>UseCase
Process<Operation>UseCase
```

固定主名称：

```text
UploadArtworkUseCase
StartArtworkDecompositionUseCase
ProcessArtworkDecompositionUseCase
UpdatePartUseCase
ApproveDecompositionUseCase
StartReferenceImageGenerationUseCase
ProcessReferenceImageGenerationUseCase
StartMultiviewGenerationUseCase
ProcessMultiviewGenerationUseCase
ApproveMultiviewUseCase
StartModelGenerationUseCase
ProcessModelGenerationUseCase
ProcessModelDownloadUseCase
ProcessModelAnalysisUseCase
ReviewModelUseCase
StartModelExportUseCase
ProcessModelExportUseCase
CreateDownloadUrlUseCase
```

### 4.5 前端 API Client

函数名与业务动作保持一致，小驼峰：

```text
uploadArtwork
startArtworkDecomposition
getDecomposition
updatePart
approveDecomposition
startReferenceImageGeneration
setActiveReferenceImageVersion
startMultiviewGeneration
approveMultiview
startModelGeneration
getModelVersion
reviewModel
startModelRegeneration
startModelExport
createDownloadUrl
```

禁止出现同义方法：`create3D / generateMesh / runTripo / approve3d`。

### 4.6 Queue Job

```text
artwork.decompose
part.reference-image.generate
part.multiview.generate
model.generate
model.download
model.analyze
model.export
```

所有 Job Payload 至少：

```ts
interface BaseJobPayload {
  jobId: string;
  idempotencyKey: string;
}
```

### 4.7 固定枚举

```text
MultiviewDirection = FRONT | LEFT | BACK
ReviewDecision     = APPROVED | REJECTED
ExportFormat       = OBJ | FBX
```

前端不得复制一套字符串常量；从共享 Contract/Domain 可公开类型导入。

---

## 5. 前端页面与目录规范

### 5.1 固定页面路由

| 页面 | Route | 页面职责 |
|---|---|---|
| Artwork 工作台 | `/` | 上传 Artwork；上传后进入拆解流程 |
| 拆解审核 | `/artworks/[artworkId]/decomposition` | 拆解状态、Part 编辑和批准 |
| Part 详情 | `/parts/[partId]` | Reference / Multiview / Model 生成进度 |
| 模型审核 | `/models/[modelVersionId]` | 3D Viewer、指标、Approve/Reject/Regenerate |
| 导出下载 | `/models/[modelVersionId]/exports` | OBJ/FBX 状态和下载 |

禁止新增：

```text
/projects
/projects/new
```

### 5.2 推荐 Web 目录

```text
apps/web/src/
├── app/
│   ├── page.tsx
│   ├── artworks/[artworkId]/decomposition/page.tsx
│   ├── parts/[partId]/page.tsx
│   └── models/[modelVersionId]/
│       ├── page.tsx
│       └── exports/page.tsx
├── features/
│   ├── artwork/
│   ├── decomposition/
│   ├── part/
│   ├── reference-image/
│   ├── multiview/
│   ├── model/
│   └── export/
├── components/
└── lib/
    └── api/
```

### 5.3 Web 架构边界

```text
Page / Component
   ↓
Feature Action / API Client
   ↓
packages/contracts
   ↓ HTTP
apps/api
```

前端只负责：

- 采集用户输入。
- 调用 API。
- 根据 Contract 展示业务状态。
- 处理浏览器交互和视觉状态。

前端禁止：

- 直接调用 OpenAI / Tripo / MinIO。
- 持有 API Key。
- 自己决定“模型是否可批准/可下载”等业务资格。
- 自己计算并覆盖服务端权威 ModelMetrics。
- 自己声明一套与 `packages/contracts` 重复的 DTO。
- 把重要业务规则写进 React Component。

### 5.4 前端通用 UI 状态

网络请求的本地 UI 状态只允许：

```text
IDLE
LOADING
SUCCESS
ERROR
```

业务工作流状态直接使用后端 Contract，例如 `MODEL_GENERATING`、`REVIEW_REQUIRED`，不要创建 `GENERATING_MODEL` 等前端同义状态。

---

## 6. 统一 API 形态

```text
POST   /api/artworks
POST   /api/decompositions
GET    /api/decompositions/:decompositionRunId
PATCH  /api/parts/:partId
POST   /api/decompositions/:decompositionRunId/approve
POST   /api/parts/:partId/reference-images
POST   /api/parts/:partId/multiviews
POST   /api/multiviews/:multiviewVersionId/approve
POST   /api/parts/:partId/models
GET    /api/models/:modelVersionId
POST   /api/models/:modelVersionId/reviews
POST   /api/models/:modelVersionId/exports
POST   /api/exports/:modelExportId/download-url
```

禁止：

```text
POST /api/projects
```

---

## 7. 全局架构边界

```text
apps/web
  ↓ HTTP + packages/contracts
apps/api
  ↓
packages/application
  ↓ ports
packages/domain

ports ← packages/infrastructure
ports ← packages/integrations/openai
ports ← packages/integrations/tripo

apps/api       = 短 HTTP 请求
apps/worker    = 长耗时任务
packages/contracts = Web/API/Worker 共享 Zod/DTO/Job Contract
```

必须遵守：

- Domain 纯 TypeScript，不依赖 NestJS/Next.js/Prisma/BullMQ/Redis/OpenAI/Tripo/AWS SDK。
- Application 通过 Port 依赖数据库、队列、存储和 Provider。
- Provider 原始类型不得进入 Domain 或 Web。
- Controller / React Component 不承载业务规则。
- OpenAI / Tripo / 转换 / 分析等长任务进入 Worker。
- Provider Response 必须先校验，再映射为内部 Contract。
- 图片和模型重新生成必须创建新版本，旧版本不得覆盖。
- Provider 临时 URL 必须转存到私有 Storage。
- API Key 不进入浏览器。
- 审批、导出、下载资格由后端决定。

---

## 8. 代码设计基准

### 8.1 前后端共享 Contract

✅ 正确：

```ts
// packages/contracts/src/artwork/upload-artwork.contract.ts
import { z } from 'zod';

export const UploadArtworkResponseSchema = z.object({
  artworkId: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export type UploadArtworkResponse = z.infer<typeof UploadArtworkResponseSchema>;
```

```ts
// apps/web/src/lib/api/upload-artwork.ts
export async function uploadArtwork(file: File): Promise<UploadArtworkResponse> {
  const response = await fetch('/api/artworks', {
    method: 'POST',
    body: createArtworkFormData(file),
  });

  const json: unknown = await response.json();
  return UploadArtworkResponseSchema.parse(json);
}
```

❌ 反面：

```ts
// Web 自己猜返回结构
interface Artwork { id: number; url: string }
const data = await fetch('/api/artworks').then(r => r.json()) as Artwork;
```

### 8.2 Application 依赖 Port

✅ 正确：

```ts
export interface ArtworkDecompositionProvider {
  decompose(input: DecomposeArtworkInput): Promise<DecompositionResult>;
}

class StartArtworkDecompositionUseCase {
  constructor(private readonly queue: JobQueuePort) {}
}

class ProcessArtworkDecompositionUseCase {
  constructor(private readonly provider: ArtworkDecompositionProvider) {}
}
```

❌ 反面：

```ts
import OpenAI from 'openai'; // packages/application 内禁止
```

### 8.3 Controller 只做协议适配

✅ 正确：

```ts
@Post('/decompositions')
create(@Body() body: unknown) {
  const input = CreateDecompositionRequestSchema.parse(body);
  return this.useCase.execute(input);
}
```

❌ 反面：

```ts
@Post('/decompositions')
async create() {
  return openai.responses.create(...); // 禁止同步调用 Provider
}
```

### 8.4 React Component 只做 UI

✅ 正确：

```tsx
<ModelReviewActions
  canApprove={model.reviewEligibility.canApprove}
  reasons={model.reviewEligibility.reasons}
  onApprove={handleApprove}
/>
```

❌ 反面：

```tsx
// React 自己实现后端审批规则
const canApprove = triangleCount <= maxTriangleCount; // 禁止
```

### 8.5 版本化

✅ 正确：

```text
ModelVersion v1 REJECTED
ModelVersion v2 APPROVED
```

❌ 反面：

```ts
await repository.overwriteCurrentModel(newFile); // 覆盖历史模型
```

---

# 9. 开发阶段

## S00 — `FOUNDATION`

**阶段状态**：`IN_PROGRESS`

**目标**：建立后端与前端统一骨架，使后续每阶段都能按同一 Contract 纵向开发。

**子任务**

- `S00.1` 建 Monorepo 目录与统一 `index.ts` 导出。
- `S00.2` 建核心 Entity / Value Object / Status。
- `S00.3` 建 `packages/contracts` 与 Zod Contract 规范。
- `S00.4` 建 Application Use Case / Port 目录。
- `S00.5` 建 NestJS API 骨架。
- `S00.6` 建 BullMQ Worker / Processor 骨架。
- `S00.7` 建 Prisma / Repository Adapter 目录。
- `S00.8` 建 Storage / Queue / Logging Port 与 Adapter 目录。
- `S00.9` 建 Next.js App Router 页面骨架和五个固定路由。
- `S00.10` 建 `apps/web/src/lib/api` API Client 规范。
- `S00.11` 建 Web 对 `packages/contracts` 的统一引用方式。
- `S00.12` 建通用 Loading / Empty / Error / Retry 组件。
- `S00.13` 建基础 App Layout / Navigation，但不实现后续业务页面内容。
- `S00.14` 建 Provider Runtime Config：`PROVIDER_MODE`、`ALLOW_PAID_PROVIDER_CALLS`，默认 `mock/false`。
- `S00.15` 建 `assertPaidProviderCallsAllowed` 与 Provider 选择器约定；API Key 存在不得自动切换 Real。
- `S00.16` `.env.example` 写入安全默认值，且不包含任何真实 Key。

**当前阶段不能做**：真实 OpenAI、Tripo 或任何付费 Provider 网络调用；不得把 `PROVIDER_MODE`/`ALLOW_PAID_PROVIDER_CALLS` 默认值改为 Real；不得因发现本机 API Key 自动启用真实调用；图片生成、GLB 分析、Three.js Viewer、OBJ/FBX、Project 创建页面/API/Use Case、后续真实业务 UI。

**架构边界**：Domain 纯 TS；Contracts 可用 Zod；Web/API/Worker 共享 Contract；Web 不直接访问 Provider/Storage；Provider 仅预留 Port/Adapter 位置。

**验收方式**：

- 目录和依赖方向符合第 7 节。
- Web 五个固定路由可解析，允许暂时显示占位状态。
- Web 可导入 `packages/contracts`。
- API Client 有固定目录与错误处理约定。
- 无 `/projects`、`POST /api/projects`、`CreateProjectUseCase`。
- `.env.example` 默认 `PROVIDER_MODE=mock`、`ALLOW_PAID_PROVIDER_CALLS=false`。
- 即使环境存在真实 API Key，Foundation 测试确认不会启用 Real Provider。
- 环境可用则四项质量命令通过，否则 `IMPLEMENTED_UNVERIFIED`。

---

## S01 — `ARTWORK_UPLOAD`

**阶段状态**：`NOT_STARTED`

**目标**：用户从 `/` 直接上传 Artwork；后端内部创建 `Project + Artwork` 并存入私有 Storage。

**子任务**

- `S01.1` Upload Artwork Contract。
- `S01.2` `ObjectStoragePort` + `ArtworkRepository`。
- `S01.3` MIME / 大小 / 图片尺寸校验。
- `S01.4` MinIO/S3 Storage Adapter。
- `S01.5` `UploadArtworkUseCase`。
- `S01.6` `POST /api/artworks`。
- `S01.7` `uploadArtwork` API Client。
- `S01.8` `/` 上传 UI：选择/拖拽、预览、上传进度、错误提示。
- `S01.9` 上传成功后进入 `/artworks/[artworkId]/decomposition`。
- `S01.10` 上传成功与拒绝测试。

**固定限制**：PNG/JPG/JPEG/WebP；20 MB；8192×8192。

**当前阶段不能做**：AI 拆解、Part 创建、暴露 Storage Key、独立 Project 创建流程。

**架构边界**：`Web → API Client → API → UploadArtworkUseCase → Repository/ObjectStoragePort`；前端校验只用于即时 UX，后端必须再次权威校验。

**验收方式**：

- 合法文件可从浏览器上传并看到预览。
- 非法格式/超限文件显示明确错误且后端拒绝。
- DB 保存 objectKey/MIME/size/width/height。
- 对象私有，浏览器无 Storage/API Key。
- 上传成功存在内部 Project 关联并正确导航。

---

## S02 — `ARTWORK_DECOMPOSE`

**阶段状态**：`NOT_STARTED`

**目标**：异步调用 OpenAI，生成 `DecompositionRun + Part[]`，前端可观察 Job 状态。

**子任务**

- `S02.1` 拆解 Contract + Provider Response Zod Schema。
- `S02.2` `ArtworkDecompositionProvider`。
- `S02.3` OpenAI Adapter（可实现真实代码，但默认不启用）。
- `S02.4` `MockArtworkDecompositionProvider` + Mock/Real 选择器。
- `S02.5` `artwork.decompose` Job Contract。
- `S02.6` `StartArtworkDecompositionUseCase`。
- `S02.7` Worker Processor + `ProcessArtworkDecompositionUseCase`。
- `S02.8` 持久化 `DecompositionRun + Part[]`。
- `S02.9` `startArtworkDecomposition/getDecomposition` API Client。
- `S02.10` 拆解页展示 Start / Queued / Running / Failed / Retry / Completed。
- `S02.11` 失败/重试/幂等测试。
- `S02.12` Provider 安全测试：默认 Mock；存在真实 Key 仍不发真实请求；Real 未双重授权时 fail fast。

**Part 固定字段**：`name/category/description/imageRegion/occlusionLevel/confidence/referenceImagePrompt/multiviewPrompt/recommendedTriangleCount/reviewRequired`。

**当前阶段不能做**：Controller 同步等待 OpenAI；默认开发/测试直接调用真实 OpenAI；Codex 自行开启付费模式；无效 AI 输出创建半成品 Part；参考图或 Tripo 生成；前端直接调用 OpenAI。

**架构边界**：`Web → API → Queue → Worker → ArtworkDecompositionProvider → Provider Selector → Mock/OpenAI Adapter → validate/map → Domain`；Mock/Real 只能在 Adapter 装配层切换。

**验收方式**：

- 浏览器发起拆解后 API 快速返回，不被 Provider 阻塞。
- UI 能显示 queued/running/failed/completed，并可重试失败任务。
- Zod 拒绝无效 Provider 输出。
- 同一 `idempotencyKey` 不重复付费。
- 默认 `PROVIDER_MODE=mock` 时完整拆解流程可走通，`Paid provider calls = 0`。
- Mock 覆盖成功/失败/超时/限流/无效响应。
- 只有双开关显式开启时才允许 OpenAI Adapter 发真实请求。
- 旧 `DecompositionRun` 不覆盖。

---

## S03 — `PART_REVIEW`

**阶段状态**：`NOT_STARTED`

**目标**：用户在拆解审核页编辑 AI Parts 并批准最终列表。

**子任务**

- `S03.1` Update Part / Approve Decomposition Contract。
- `S03.2` 修改名称/描述/区域/三角面/Prompt。
- `S03.3` 新增/删除 Part。
- `S03.4` `ApproveDecompositionUseCase`。
- `S03.5` `updatePart/approveDecomposition` API Client。
- `S03.6` 拆解审核 UI：列表、编辑表单、新增、删除、保存、批准。
- `S03.7` 已批准后的锁定/状态提示。
- `S03.8` 未批准门禁测试。

**当前阶段不能做**：未批准 Parts 启动模型生成；提前建 `ModelVersion`；把编辑/批准规则塞进 React。

**架构边界**：规则在 Domain/Application；Web 只提交 Contract 字段并展示后端决定的可编辑/可批准状态。

**验收方式**：

- 浏览器可增删改 Part，刷新后仍存在。
- 批准状态持久化。
- 已批准 UI 状态明确。
- 未批准状态被后续生成 Use Case 权威拒绝。

---

## S04 — `REFERENCE_IMAGE`

**阶段状态**：`NOT_STARTED`

**目标**：每个批准 Part 独立生成并版本化参考图，并可在 Part 详情页管理版本。

**子任务**

- `S04.1` `ReferenceImageProvider`。
- `S04.2` Real Image Adapter（若使用付费 Provider，可实现但默认不启用）+ `MockReferenceImageProvider`。
- `S04.3` `part.reference-image.generate` Job。
- `S04.4` Start/Process Reference Image Use Cases。
- `S04.5` Worker 调 Provider 并转存 Storage。
- `S04.6` 创建 `ReferenceImageVersion`。
- `S04.7` active version 切换。
- `S04.8` API Client：生成、查询版本、切换 active。
- `S04.9` Part 详情页展示版本列表、当前 active、Generate/Regenerate、失败 Retry。
- `S04.10` 失败隔离/版本测试。
- `S04.11` Mock 模式使用本地/测试 Storage fixture，验证不产生真实付费图片请求。

**当前阶段不能做**：默认开发/测试调用真实付费图片 Provider；覆盖旧图；保存 Provider 临时 URL 为永久地址；一个 Part 失败阻塞其他 Part。

**架构边界**：Provider 细节仅在 integration；`ReferenceImageProvider` 的 Mock/Real 只能在 Adapter 装配层切换；版本规则在 Domain/Application；Web 只使用应用 Storage 资源接口。

**验收方式**：重新生成创建新版本；旧版本可查看；active 可切换；UI 显示生成/失败状态；Part 间失败隔离；默认 Mock 流程可走通且 `Paid provider calls = 0`。

---

## S05 — `MULTIVIEW`

**阶段状态**：`NOT_STARTED`

**目标**：生成同一 `MultiviewVersion` 下的 `FRONT/LEFT/BACK`，用户审核后才能进入 Tripo。

**子任务**

- `S05.1` `MultiviewImageProvider`。
- `S05.2` Real Multiview Adapter（若使用付费 Provider，可实现但默认不启用）+ `MockMultiviewImageProvider`。
- `S05.3` `part.multiview.generate` Job。
- `S05.4` Start/Process Multiview Use Cases。
- `S05.5` 同版本保存 FRONT/LEFT/BACK。
- `S05.6` `ApproveMultiviewUseCase`。
- `S05.7` API Client：生成/查询/批准。
- `S05.8` Part 详情页三视图预览、版本切换、重生成、批准 UI。
- `S05.9` 批准门禁测试。
- `S05.10` Mock 模式生成 FRONT/LEFT/BACK fixture，验证不产生真实付费图片请求。

**当前阶段不能做**：默认开发/测试调用真实付费图片 Provider；未批准版本提交 Tripo；覆盖旧版本；把三个方向拆成互不关联版本。

**架构边界**：`MultiviewVersion` 是三图版本容器；`MultiviewImageProvider` 的 Mock/Real 只能在 Adapter 装配层切换；本阶段不接 Tripo；前端方向值只用 `FRONT/LEFT/BACK`。

**验收方式**：三方向完整；浏览器可预览/重生成/批准；旧版本可查看；未批准版本被模型生成入口拒绝；默认 Mock 流程 `Paid provider calls = 0`。

---

## S06 — `MODEL_GENERATION`

**阶段状态**：`NOT_STARTED`

**目标**：将批准 Multiview 按 FRONT→LEFT→BACK 提交 Tripo，并让用户看到 `ModelVersion` 生成状态。

**子任务**

- `S06.1` `ModelGenerationProvider` + Tripo Adapter（可实现真实代码，但默认不启用）。
- `S06.2` `MockModelGenerationProvider` + Mock/Real 选择器。
- `S06.3` `model.generate` Job。
- `S06.4` Start/Process Model Generation Use Cases。
- `S06.5` 保存 `providerTaskId`。
- `S06.6` Provider 状态映射。
- `S06.7` 幂等与有限重试。
- `S06.8` `startModelGeneration/getModelVersion` API Client。
- `S06.9` Part 详情页 Generate Model 按钮和 queued/running/terminal 状态 UI。
- `S06.10` 失败时显示可操作 Retry，不显示 Provider 原始错误对象。
- `S06.11` Provider 安全测试：默认 Mock；真实 Tripo Key 存在仍不发请求；Real 未双重授权时 fail fast。

**当前阶段不能做**：默认开发/测试调用真实 Tripo；Codex 自行开启付费模式；未批准 Multiview 提交；Worker 重跑重复建 Tripo Task；硬编码模型版本/API URL；给前端 Tripo 临时 URL。

**架构边界**：Tripo 仅在 integration；`ModelGenerationProvider` 的 Mock/Real 只能在 Adapter 装配层切换；Worker 调 Provider；API 只创建/查询任务；Web 只消费内部状态。

**验收方式**：视图顺序固定；face limit 来自 Part；Task ID 保存；状态映射完整；重复 Job 不重复付费；用户可从浏览器明确看到生成进度；默认 Mock 可模拟 queued/running/succeeded/failed 且 `Paid provider calls = 0`；只有双开关显式开启时才允许 Tripo Adapter 发真实请求。

---

## S07 — `MODEL_STORAGE`

**阶段状态**：`NOT_STARTED`

**目标**：Tripo 成功后立即下载 GLB 到应用私有 Storage。

**子任务**

- `S07.1` `model.download` Job。
- `S07.2` `ProcessModelDownloadUseCase`。
- `S07.3` 下载 timeout/error handling。
- `S07.4` GLB 保存到私有 Storage。
- `S07.5` objectKey 关联 `ModelVersion`。
- `S07.6` Web 将模型状态展示为 `MODEL_DOWNLOADING`，失败时可重试。

**当前阶段不能做**：把 Provider URL 当永久模型 URL；暴露 Provider URL；下载失败却标记完成。

**架构边界**：下载在 Worker/integration；持久层只保存应用 Storage objectKey；Web 不知道 Provider URL；Mock 模式从本地 fixture/Test Storage 获取 GLB，不访问真实 Tripo URL。

**验收方式**：Provider URL 失效后仍能读取 GLB；下载失败状态明确；前端只显示内部状态且拿不到 Provider URL。

---

## S08 — `MODEL_ANALYSIS`

**阶段状态**：`NOT_STARTED`

**目标**：服务端分析 GLB，保存权威 `ModelAnalysis`，前端展示分析进度和结果摘要。

**子任务**

- `S08.1` Analyzer Port。
- `S08.2` `model.analyze` Job + `ProcessModelAnalysisUseCase`。
- `S08.3` 解析 GLB。
- `S08.4` 计算 `ModelMetrics`。
- `S08.5` 与 `ModelRequirements` 比较。
- `S08.6` 保存 `analyzerVersion`。
- `S08.7` 空/损坏文件处理。
- `S08.8` Web 显示 `MODEL_ANALYZING` 和分析完成后的核心指标/错误。

**ModelMetrics 固定字段**：`triangleCount/vertexCount/meshCount/materialCount/textureCount/fileSizeBytes/boundingBox`。

**当前阶段不能做**：浏览器计算值覆盖服务端值；损坏 GLB 进入审核成功状态。

**架构边界**：Analyzer 在 Worker/服务端；Web 只能展示服务端 `ModelAnalysis`。

**验收方式**：指标完整；空/损坏 GLB 拒绝；成功后 `ModelVersion → REVIEW_REQUIRED`；浏览器显示的数据与服务端一致。

---

## S09 — `MODEL_PREVIEW`

**阶段状态**：`NOT_STARTED`

**目标**：在 `/models/[modelVersionId]` 使用 Three.js/R3F/Drei 浏览 GLB 和后端指标。

**子任务**

- `S09.1` 模型资源读取接口/应用 Storage 访问策略。
- `S09.2` GLB Loader + 自动居中。
- `S09.3` Rotate/Zoom/Pan/Reset。
- `S09.4` Front/Left/Back/Right/Top。
- `S09.5` Solid/Wireframe。
- `S09.6` 显示 `ModelMetrics`。
- `S09.7` Loading / 加载失败 / 大模型状态。

**当前阶段不能做**：前端重新定义模型验收；调用 Tripo；决定下载资格；用浏览器计算指标替代 `ModelAnalysis`。

**架构边界**：Viewer 负责交互展示；后端负责权威指标和资源资格。

**验收方式**：GLB 可旋转/缩放/平移/重置；五视角和 Wireframe 可用；指标一致；加载失败有清晰 UI；大模型页面仍可操作。

---

## S10 — `MODEL_REVIEW`

**阶段状态**：`NOT_STARTED`

**目标**：针对具体 `ModelVersion` 保存 `APPROVED/REJECTED` 审核，并在模型页完成操作。

**子任务**

- `S10.1` Model Review Contract。
- `S10.2` `ReviewModelUseCase`。
- `S10.3` 保存 decision/comment/timestamp/metricSnapshot。
- `S10.4` hard triangle limit。
- `S10.5` warning 显式确认。
- `S10.6` `reviewModel` API Client。
- `S10.7` 模型页 Approve/Reject、备注、warning 确认 UI。
- `S10.8` 后端返回 `reviewEligibility`，前端据此展示禁用原因。

**当前阶段不能做**：审核只绑定 Part；Reject 删除模型；超硬上限仍批准；React 自己推导审批资格。

**架构边界**：审批规则只在 Domain/Application；Web 展示后端 `reviewEligibility` 并提交用户决定。

**验收方式**：审核绑定 `modelVersionId`；保存指标快照；Rejected 模型仍可读；违规批准被后端拒绝且 UI 能说明原因；未批准模型不能 Export。

---

## S11 — `MODEL_REGENERATION`

**阶段状态**：`NOT_STARTED`

**目标**：Reject 后基于新要求创建新的 `ModelVersion`，并允许用户查看历史版本。

**子任务**

- `S11.1` Regeneration Contract。
- `S11.2` 保存新 triangle/instructions。
- `S11.3` 新建 `ModelVersion`。
- `S11.4` 复用 S06 生成管线。
- `S11.5` `startModelRegeneration` API Client。
- `S11.6` 模型页 Regenerate 表单。
- `S11.7` 历史版本列表和 v1/v2/vN 切换。

**当前阶段不能做**：覆盖旧 `ModelVersion`；删除 rejected version；复制第二套 Tripo 流程。

**架构边界**：复用 S06 Use Case/Job；Web 只提交新要求和选择历史版本。

**验收方式**：新生成有新 `modelVersionId`；旧版本不变；浏览器可在历史版本间切换并看到各自审核状态。

---

## S12 — `MODEL_EXPORT`

**阶段状态**：`NOT_STARTED`

**目标**：仅为批准的 ModelVersion 独立创建并验证 OBJ/FBX，同时提供导出状态 UI。

**子任务**

- `S12.1` `ModelExport` Contract/Entity。
- `S12.2` `model.export` Job。
- `S12.3` Start/Process Model Export Use Cases。
- `S12.4` OBJ 转换/验证/ZIP。
- `S12.5` FBX 转换/验证。
- `S12.6` 导出文件转私有 Storage。
- `S12.7` `startModelExport` API Client。
- `S12.8` `/models/[modelVersionId]/exports` 展示 OBJ/FBX 独立状态、Retry、验证结果。
- `S12.9` 幂等/失败隔离测试。

**当前阶段不能做**：未批准模型 Export；OBJ 失败联动 FBX 失败；未验证成功进入 `DOWNLOAD_READY`。

**架构边界**：转换/验证在 Worker；Converter 不决定下载权限；Web 只展示内部 Export 状态。

**验收方式**：OBJ/FBX 独立状态；一个失败不影响另一个；重复 Job 不重复转换；浏览器可清晰看到验证结果；合法导出进入 `DOWNLOAD_READY`。

---

## S13 — `DOWNLOAD`

**阶段状态**：`NOT_STARTED`

**目标**：仅为批准模型的已验证 Export 生成短时 Signed URL，并提供可控下载 UI。

**子任务**

- `S13.1` Download Contract。
- `S13.2` `CreateDownloadUrlUseCase`。
- `S13.3` Review/Export Validation 门禁。
- `S13.4` Storage Signed URL。
- `S13.5` `createDownloadUrl` API Client。
- `S13.6` 导出页 Download 按钮、生成 URL、过期后重新申请。
- `S13.7` 未批准/未验证/过期测试。

**当前阶段不能做**：未批准模型下载；未验证 Export 下载；返回 Provider 临时 URL；前端永久缓存 Signed URL。

**架构边界**：资格判断只在后端 Application；Web 只消费短时 URL。

**验收方式**：请求绑定 `modelExportId + modelVersionId`；URL 会过期且指向应用私有 Storage；不满足资格时后端拒绝且 UI 明确展示。

---

## S14 — `RELIABILITY`

**阶段状态**：`NOT_STARTED`

**目标**：统一补齐幂等、重试、超时、限流、日志、Secret 和前端异常恢复体验。

**子任务**

- `S14.1` 唯一 `jobId` + 付费操作 `idempotencyKey`。
- `S14.2` 可重试/永久错误分类。
- `S14.3` 外部 HTTP timeout。
- `S14.4` 安全日志。
- `S14.5` 付费操作并发/速率限制。
- `S14.6` `.env.example` 与 Secret 检查；再次确认 `PROVIDER_MODE=mock`、`ALLOW_PAID_PROVIDER_CALLS=false` 为默认值。
- `S14.7` Web 全局 Error Boundary / 通用 Retry 体验。
- `S14.8` 统一 Provider 错误 → 内部错误码 → 用户可读文案映射。

**当前阶段不能做**：登录/多用户/团队权限；部件拼装；Rigging；Animation；Scene Composition。

**架构边界**：可靠性规则在 Application/Infrastructure；Secret 只在服务端；前端只消费稳定错误 Contract，不显示 Authorization/Header/Provider 原始对象。

**验收方式**：Worker 重启不破坏状态；重复 Delivery 不重复付费；单 Part 失败不阻塞其他 Part；浏览器可从可恢复错误 Retry；Git/浏览器无 Secret。

---

## S15 — `E2E_RELEASE`

**阶段状态**：`NOT_STARTED`

**目标**：自动化验证完整产品闭环，包含真实浏览器页面流转。

**子任务**

- `S15.1` Domain 状态单测。
- `S15.2` Repository Adapter 集成测试。
- `S15.3` OpenAI/Tripo Mock Provider 测试。
- `S15.4` 幂等/审批/下载资格测试。
- `S15.5` Playwright 完整浏览器主流程。
- `S15.6` Playwright 错误/Retry/版本切换关键路径。
- `S15.7` Provider 网络安全测试：Mock 模式拦截/检测对 OpenAI、Tripo 域名的意外出站请求。
- `S15.8` lint/typecheck/test/build。

**固定 E2E**：

```text
打开 /
→ Upload Artwork
→ 进入 Decomposition 页面
→ Start Decomposition
→ Edit/Approve Parts
→ 打开 Part Detail
→ Generate ReferenceImageVersion
→ Generate/Approve MultiviewVersion
→ Generate ModelVersion
→ Store GLB
→ ModelAnalysis
→ 打开 Model Review
→ Browser Preview
→ ModelReview(APPROVED)
→ 打开 Exports
→ OBJ/FBX Export
→ Validation
→ Signed Download URL
```

附加场景：一个 Part Reject → Regenerate 不影响已完成 Part。

**当前阶段不能做**：默认测试使用生产 API Key；`pnpm test`/`pnpm test:e2e` 触发任何真实付费 Provider 调用；真实 Provider Test 默认开启；Codex 自动切换 `PROVIDER_MODE=real` 或 `ALLOW_PAID_PROVIDER_CALLS=true`；只测 API 而跳过关键页面；用手工点击替代关键自动化测试。

**架构边界**：E2E 测真实 Web/API/Worker/Storage 边界；Provider 默认 Mock；真实 Provider 测试必须使用独立命令并同时显式设置 `PROVIDER_MODE=real`、`ALLOW_PAID_PROVIDER_CALLS=true`，不得属于默认发布验收。

**验收方式**：Playwright 主流程通过；关键页面都有应用自身真实 Contract/API 数据；Provider 为 Mock；默认测试无需生产凭据；记录 `Paid provider calls = 0`；lint/typecheck/test/build 全通过。

---

## 10. Part 状态唯一集合

后续阶段必须复用，禁止添加同义状态：

```text
PENDING
REFERENCE_GENERATING
REFERENCE_REVIEW
MULTIVIEW_GENERATING
MULTIVIEW_REVIEW
MODEL_SUBMITTING
MODEL_GENERATING
MODEL_DOWNLOADING
MODEL_ANALYZING
REVIEW_REQUIRED
APPROVED
REJECTED
EXPORTING
DOWNLOAD_READY
FAILED
CANCELED
```

Provider 的 `expired/cancelled/rejected/...` 必须先映射为内部状态或独立 Provider Task 状态，不能直接泄漏到 Web Contract。

---

## 11. 每阶段固定交付报告

Codex 每完成一个阶段必须输出：

```md
## Stage Result

- Stage: `Sxx_NAME`
- Status: `DONE | IMPLEMENTED_UNVERIFIED | BLOCKED`

### Completed
- ...

### Backend
- ...

### Frontend
- Route: `...`
- Implemented UI states: `...`
- Contract/API used: `...`

### Changed Files
- `path/to/file`

### Git
- Base branch: `<resolved-base-branch>`
- Task branches: `<branch list>`
- Commits: `<sha list>`
- Push to GitHub: PASS / PUSH_BLOCKED
- Rollback point: `<latest accepted commit sha>`

### Verification
- Provider mode: `mock | real`
- Paid provider calls: `0 | <count>`
- Browser acceptance: PASS / FAIL / NOT_RUN
- `pnpm lint`: PASS / NOT_RUN
- `pnpm typecheck`: PASS / NOT_RUN
- `pnpm test`: PASS / NOT_RUN
- `pnpm build`: PASS / NOT_RUN

### Remaining Risks
- None / ...

### Next Stage
- `Sxx_NEXT`
```

如果本阶段未验收：**不要开始下一阶段。**

---

## 12. 首次执行指令

现在只执行：

```text
S00_FOUNDATION
```

顺序：

> 每个 `S00.n` 都是独立 Git 任务：必须先创建独立分支、完成验收、Commit 并 Push，再进入下一个 `S00.n`。

```text
S00.1 → S00.2 → S00.3 → S00.4 → S00.5 → S00.6 → S00.7 → S00.8
→ S00.9 → S00.10 → S00.11 → S00.12 → S00.13 → S00.14 → S00.15 → S00.16
```

`S00` 未完成前禁止开始：

```text
S01_ARTWORK_UPLOAD
OpenAI Integration
Tripo Integration
Three.js Viewer
OBJ / FBX Export
真实付费 Provider 调用
```
