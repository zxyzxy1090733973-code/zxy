# ACCEPTANCE_CRITERIA.md

## 1. Repository Initialization

The repository initialization is accepted when:

- `pnpm install` completes successfully.
- `pnpm build` completes successfully.
- `pnpm lint` completes successfully.
- `pnpm typecheck` completes successfully.
- `pnpm test` completes successfully.
- Docker Compose starts PostgreSQL, Redis, and MinIO.
- No real API key exists in tracked files.
- `.env.example` documents all required environment variables.

## 2. Runtime Scope

The release is accepted when:

- The application works as local single-user software.
- No login, account, role, team, organization, or multi-user collaboration feature is implemented.

## 3. Project Creation

The project creation feature is accepted when:

- The user can create a project.
- The project receives a unique ID.
- The project starts in `DRAFT`.
- The project stores default model requirements.

## 4. Artwork Upload

The upload feature is accepted when:

- PNG, JPG, JPEG, and WebP uploads succeed.
- Unsupported formats are rejected.
- Files above the configured size limit are rejected.
- Images above the configured dimension limit are rejected.
- The uploaded file is stored in private object storage.
- The database stores the object key, MIME type, size, width, and height.
- The API key for object storage is not exposed to the browser.

## 5. Artwork Decomposition

The decomposition feature is accepted when:

- The API creates a background job instead of waiting for OpenAI synchronously.
- The OpenAI response is validated with a Zod schema.
- Invalid AI output does not create incomplete parts.
- A valid result creates a decomposition run and part records.
- The result contains names, descriptions, regions, confidence, and prompts.
- Repeating the same paid job does not create duplicate provider submissions.
- OpenAI failure moves the decomposition run into a failed state.
- The user can retry a failed decomposition.
- Previous decomposition versions are not overwritten.

## 6. Decomposition Review

The review feature is accepted when:

- The user can rename a part.
- The user can change its description.
- The user can change its triangle-count requirements.
- The user can delete an unnecessary part.
- The user can add a missing part.
- The user can approve the final part list.
- Model generation cannot begin before approval.

## 7. Reference Image Generation

The feature is accepted when:

- Each part can create an independent generation job.
- A failed part does not stop unrelated parts.
- Generated files are copied into private object storage.
- Provider temporary URLs are not saved as permanent asset URLs.
- Regeneration creates a new image version.
- Older image versions remain available.
- The user can choose which image version is active.

## 8. Multiview Generation

The feature is accepted when:

- The system creates front, left, and back images.
- Each image has a recorded direction.
- All three images belong to one multiview version.
- The user can preview all three views.
- The user can regenerate the multiview set.
- Regeneration does not overwrite previous versions.
- The user can approve a multiview set before model generation.
- Tripo generation cannot start without an approved multiview set.

## 9. Tripo Model Generation

The feature is accepted when:

- The system sends front, left, and back views in the expected order.
- The Tripo model version comes from configuration.
- The face limit comes from the part's model requirements.
- The provider task ID is stored.
- Queued and running progress is visible to the user.
- Task statuses are mapped into internal statuses.
- Repeated worker execution does not create duplicate Tripo tasks.
- A successful model is immediately downloaded to private storage.
- The frontend never receives a provider temporary URL.
- Failed, expired, cancelled, and rejected tasks can be handled separately.
- A new retry creates a new model version only when appropriate.

## 10. GLB Model Analysis

The feature is accepted when:

- The stored GLB can be parsed by the server-side analyzer.
- Triangle count is recorded.
- Vertex count is recorded.
- Mesh count is recorded.
- Material count is recorded.
- File size is recorded.
- Bounding-box dimensions are recorded.
- Analysis errors produce an explicit failed status.
- An empty or damaged GLB is rejected.
- The analyzer version is stored.
- Server-side metrics are treated as authoritative.

## 11. Browser Model Preview

The feature is accepted when:

- The GLB loads through Three.js or React Three Fiber.
- The user can rotate the model.
- The user can zoom.
- The user can pan.
- The user can reset the camera.
- The model is automatically centered.
- The user can switch to wireframe mode.
- The user can view front, left, back, right, and top angles.
- Triangle count, vertex count, mesh count, and file size are displayed.
- A clear error is shown when loading fails.
- The page remains usable when the model is large.

## 12. Model Review

The feature is accepted when:

- A generated model enters `REVIEW_REQUIRED` after analysis.
- The user can approve a specific model version.
- The user can reject a specific model version.
- A review records decision, comment, timestamp, and metric snapshot.
- A model above a hard triangle limit cannot be approved.
- Warning-level issues can require explicit confirmation.
- Rejecting a model does not delete it.
- Regeneration creates a new model version.

## 13. OBJ and FBX Export

The feature is accepted when:

- Export tasks cannot be created for an unapproved model.
- Approval can trigger independent OBJ and FBX jobs.
- OBJ and FBX have separate statuses.
- Failed OBJ export does not automatically fail FBX export.
- Failed FBX export does not automatically fail OBJ export.
- Repeated queue execution does not create duplicate conversion tasks.
- Exported files are downloaded into private storage.
- OBJ packages contain required OBJ, MTL, and texture files when available.
- Texture paths in OBJ packages are relative.
- FBX files can be parsed by the configured validator.
- Validation errors prevent download readiness.
- Successful exports enter `DOWNLOAD_READY`.

## 14. Download Eligibility

The feature is accepted when:

- Unapproved models cannot be downloaded.
- Unvalidated exports cannot be downloaded.
- Download URLs are short-lived.
- Download URLs refer to private application storage.
- Provider temporary URLs are never returned.
- Download requests reference a specific export ID and model version.

## 15. Queue and Retry Behavior

The queue system is accepted when:

- Long-running work runs outside HTTP request handlers.
- Every job has a unique job ID.
- Paid operations have idempotency keys.
- Retriable network errors use limited retries.
- Permanent validation errors are not retried indefinitely.
- One part's failure does not stop unrelated parts.
- Worker restart does not corrupt workflow state.
- Duplicate delivery of the same job does not duplicate paid operations.

## 16. Security

The system is accepted when:

- No API key appears in frontend source or browser bundles.
- No `.env` file is tracked by Git.
- File uploads are validated.
- External HTTP requests have timeouts.
- Logs do not contain authorization headers.
- Rate limits exist on paid operations.
- Object storage is private.
- Signed download URLs expire.
- Provider responses are validated before use.

## 17. Automated Tests

The project is accepted for release when:

- Domain status transitions have unit tests.
- Repository adapters have integration tests.
- OpenAI adapters use mocked provider responses in normal test runs.
- Tripo adapters use mocked provider responses in normal test runs.
- Idempotency behavior has automated tests.
- Download eligibility checks have automated tests.
- Model approval rules have automated tests.
- The complete user workflow has a Playwright test.
- Tests do not require production API credentials.
- Real provider integration tests are disabled unless explicitly enabled.

## 18. End-to-End Scenario

The main end-to-end flow is accepted when:

1. The user creates a project.
2. The user uploads one valid artwork.
3. The system produces a decomposition result.
4. The user edits and approves the parts.
5. The system generates reference and multiview images.
6. The user approves one multiview set.
7. The system generates and stores one GLB model.
8. The server analyzes the GLB.
9. The browser previews the GLB.
10. The user sees the triangle count.
11. The user cannot download before approval.
12. The user approves the model.
13. The system creates OBJ and FBX exports.
14. Both exports pass validation.
15. The user receives short-lived download links.
16. Rejecting and regenerating another part does not affect the completed part.
