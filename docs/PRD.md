# PRD.md

## 1. Product Name

Concept Art to Separate 3D Models

## 2. Product Goal

The product allows a local single user to upload one concept artwork, split the artwork into independent parts with AI assistance, generate multiview reference images for each part, create separate 3D models through Tripo, preview and review each model in the browser, and download approved models as OBJ and FBX files.

The product does not assemble the separate models into one complete character or scene.

## 3. Runtime Scope

The current version does not include user login, account management, roles, teams, organizations, or multi-user collaboration.

## 4. Target Users

- Concept artists
- 3D artists
- Game art teams
- Animation and visual development teams
- Independent creators who need draft 3D assets from concept images

## 5. Core User Workflow

### 5.1 Create Project

The user creates a project and enters:

- Project name
- Default target triangle count
- Maximum triangle count
- Whether textures are required
- Whether PBR materials are required
- Maximum model file size

### 5.2 Upload Concept Artwork

The user uploads one artwork.

Supported formats:

- PNG
- JPG or JPEG
- WebP

Initial limits:

- Maximum file size: 20 MB
- Maximum image dimensions: 8192 x 8192
- One source artwork per project

### 5.3 Analyze and Decompose Artwork

The system sends the artwork and user instructions to OpenAI.

OpenAI returns a structured decomposition result containing:

- Part name
- Part category
- Part description
- Approximate image region
- Occlusion level
- Confidence
- Reference-image prompt
- Multiview-generation prompt
- Recommended triangle count
- Whether user review is required

### 5.4 Review Decomposition

The user can:

- Rename a part
- Edit the description
- Delete an unnecessary part
- Add a missing part
- Modify the approximate region
- Change the target triangle count
- Change the maximum triangle count
- Edit the reference-image prompt
- Edit the multiview prompt
- Approve the final part list

The system must not begin paid model generation before the part list is approved.

### 5.5 Generate Part Reference Image

For each approved part, the system generates an isolated reference image.

Requirements:

- Only one main object
- Clean or transparent background
- Object fully visible
- Original design preserved
- Occluded regions reconstructed where possible
- No unrelated objects
- New generation creates a new image version

### 5.6 Generate Multiview Images

For each part, the system generates:

- Front view
- Left-side view
- Back view

Requirements:

- The same object in all views
- Identical proportions
- Consistent colors and materials
- Orthographic appearance
- No perspective distortion
- Same scale and alignment
- Clean background
- No labels or decorative borders

The user can review and regenerate the multiview images before submitting them to Tripo.

### 5.7 Generate 3D Model

After the multiview images are approved, the system submits them to Tripo.

The system must:

- Create one Tripo task per part and model version
- Save the Tripo task ID
- Track queued, running, successful, failed, expired, cancelled, and rejected states
- Avoid duplicate paid submissions
- Download the resulting GLB immediately after generation succeeds
- Save the GLB in private object storage
- Never rely on a temporary provider URL for permanent access

### 5.8 Analyze Model

After downloading the GLB, the system analyzes:

- Triangle count
- Vertex count
- Mesh count
- Material count
- Texture count
- File size
- Bounding-box dimensions
- Degenerate triangles
- Non-manifold edges, when supported

The model is compared against the part requirements.

Possible check results:

- Passed
- Warning
- Failed

### 5.9 Preview and Review Model

The user previews the GLB in the browser.

The viewer must support:

- Rotate
- Zoom
- Pan
- Reset camera
- Front view
- Left view
- Back view
- Right view
- Top view
- Solid mode
- Wireframe mode
- Texture visibility
- Material visibility
- Fullscreen view

The review panel displays:

- Triangle count
- Target triangle count
- Maximum triangle count
- Vertex count
- Mesh count
- Material count
- Texture count
- File size
- Automated validation results

The user can:

- Approve the model
- Reject the model
- Enter a rejection reason
- Change the requested triangle count
- Add regeneration instructions
- Generate a new model version

### 5.10 Export and Download

OBJ and FBX exports are created only after the user approves a specific model version.

The system must:

- Create independent OBJ and FBX export tasks
- Validate the exported files
- Store exports in private object storage
- Enable download only after validation succeeds
- Create short-lived signed download URLs
- Issue download URLs only for approved model versions and validated exports

OBJ delivery should be packaged as a ZIP containing:

- OBJ file
- MTL file, when available
- Texture files
- Relative texture paths

FBX should be delivered as an FBX file or ZIP package when additional texture files are required.

## 6. Project Statuses

- DRAFT
- ARTWORK_UPLOADED
- DECOMPOSING
- DECOMPOSITION_REVIEW
- PROCESSING_PARTS
- PARTIALLY_COMPLETED
- COMPLETED
- FAILED
- CANCELED

## 7. Part Statuses

- PENDING
- REFERENCE_GENERATING
- REFERENCE_REVIEW
- MULTIVIEW_GENERATING
- MULTIVIEW_REVIEW
- MODEL_SUBMITTING
- MODEL_GENERATING
- MODEL_DOWNLOADING
- MODEL_ANALYZING
- REVIEW_REQUIRED
- APPROVED
- REJECTED
- EXPORTING
- DOWNLOAD_READY
- FAILED
- CANCELED

## 8. Model Version Rules

- Every model generation creates a new version.
- A new version must not overwrite an old version.
- Review decisions apply to one specific model version.
- Only approved versions may be exported.
- Previous rejected models remain available in project history.
- The user may compare previous model versions.

## 9. Error Handling

The system must provide understandable errors for:

- Unsupported upload format
- File too large
- OpenAI request failure
- Invalid AI decomposition output
- Image generation failure
- Tripo submission failure
- Tripo generation failure
- Provider timeout
- Provider rate limit
- Insufficient provider credits
- Model download failure
- Invalid or damaged GLB
- OBJ conversion failure
- FBX conversion failure
- Export validation failure
- Invalid review or download request

Failure of one part must not stop other parts.

## 10. Usage and Cost Controls

The system should support:

- Maximum number of parts per project
- Maximum model generations per part
- Maximum concurrent Tripo tasks
- Maximum concurrent image-generation tasks
- Daily usage limit
- Per-project cost estimate
- Provider request audit records

## 11. Pages

### Project List

- View projects
- Create project
- View project status

### Project Workspace

- Upload source artwork
- View source artwork
- Start decomposition
- View and edit decomposition
- Approve part list
- View each part and its progress

### Part Detail

- View part description
- View reference image versions
- View multiview versions
- Regenerate images
- Start model generation
- View generation status
- View model versions

### Model Review

- Preview GLB
- View model metrics
- View automated checks
- Approve model
- Reject model
- Enter regeneration requirements

### Downloads

- View approved model versions
- View OBJ status
- View FBX status
- Download OBJ package
- Download FBX package
- Download all available formats

## 12. Out of Scope

The first version will not include:

- User login
- Account management
- Roles, teams, or organizations
- Multi-user collaboration
- Automatic assembly of separate parts
- Model alignment between parts
- Shared coordinate-system generation
- Seam processing
- Skeleton rigging
- Animation generation
- Character posing
- Online mesh editing
- Online texture painting
- Scene editing
- Combined export of all parts
- Automatic retopology beyond provider-supported parameters

## 13. Initial Success Metrics

- A user can complete the full workflow without developer intervention.
- Failed parts can be retried independently.
- No duplicate Tripo task is created by repeated queue execution.
- Generated GLB files can be previewed in the browser.
- Triangle count is visible before approval.
- OBJ and FBX cannot be downloaded before approval.
- Approved OBJ and FBX exports pass automated validation.
