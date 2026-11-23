# Thinkz AI — CI/CD Pipeline & Zero-Downtime Blue-Green Architecture

**CI/CD Platform:** GitHub Actions (`.github/workflows/ci.yml` & `.github/workflows/ecr-publish.yml`)
**Deployment Strategy:** Zero-Downtime Blue-Green Deployment via Nginx Upstream (`5000` ↔ `5001`)
**Container Registry:** AWS ECR (`ap-south-2` / `thinkz-prod-api`)
**Target Server:** AWS EC2 `ThinkzAI-Prod-App` (`40.192.27.248`)

---

## 1. End-to-End CI/CD Sequence Diagram

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant GH as GitHub (main branch)
    participant CI as GitHub Actions (ci.yml)
    participant CD as GitHub Actions (ecr-publish.yml)
    participant ECR as AWS ECR (ap-south-2)
    participant EC2 as AWS EC2 (deploy.sh)
    participant Nginx as Nginx Upstream (5000/5001)

    Dev->>GH: git push / merge PR to main
    GH->>CI: Trigger Thinkz AI CI
    CI->>CI: Backend lint & CI tests (Node 20)
    CI->>CI: Frontend lint, tests & build (Node 22)
    CI->>CI: Docker build (<400MB & non-root check)

    alt CI Fails
        CI-->>Dev: Pipeline stops (Production untouched)
    else CI Succeeds
        CI->>CD: Auto-trigger via workflow_run (completed + success)
        CD->>ECR: Authenticate via AWS OIDC Role & push tagged image
        CD->>EC2: SSH via deploy key & run ~/scripts/deploy.sh <IMAGE_URI>
        EC2->>ECR: aws ecr get-login-password + docker pull
        EC2->>EC2: Start new container on idle slot (BLUE 5000 or GREEN 5001)
        EC2->>EC2: Poll http://127.0.0.1:<NEW_PORT>/api/health (up to 10x3s)

        alt Health Check Passes (HTTP 200)
            EC2->>Nginx: Update 00-thinkz-upstream.conf + nginx -t + reload (0s downtime)
            EC2->>Nginx: Verify live http://127.0.0.1/api/health == 200
            EC2->>EC2: Stop & remove old container
            EC2-->>CD: Zero-Downtime Deploy Complete
        else Health Check Fails
            EC2->>EC2: Print container logs & remove failed container
            EC2-->>CD: Exit 1 (Live container & Nginx untouched)
        end
    end
```

---

## 2. Pipeline Workflows

| Workflow File | Trigger | Purpose |
|---|---|---|
| `.github/workflows/ci.yml` | Push & PR to `main`, manual dispatch | Runs Backend Quality, Frontend Quality, and Backend Docker Build checks (`<400 MB`, non-root user) |
| `.github/workflows/ecr-publish.yml` | Automatic on `Thinkz AI CI` success on `main` push, or manual dispatch | Assumes AWS OIDC role (`ThinkzAI-GitHub-ECR-Push`), pushes image to ECR, and deploys to EC2 via SSH |
| `.github/workflows/aws-auth-check.yml` | Manual dispatch | Verifies GitHub OIDC → AWS IAM connectivity |

---

## 3. Zero-Downtime Blue-Green Rollback Procedure

- **Automatic Rollback:** If the new container fails `/api/health` on the idle port (or if the post-reload live check fails), `~/scripts/deploy.sh` prints the container logs, restores the previous Nginx upstream port, removes the failed container, and leaves live users unaffected.
- **Manual Rollback:** Re-run `~/scripts/deploy.sh <PREVIOUS_ECR_IMAGE_URI>` on EC2 to switch back to any previous verified ECR image with zero downtime.

---

## 4. Required GitHub Repository Secrets

| Secret Name | Purpose |
|---|---|
| `EC2_HOST` | Public IP of `ThinkzAI-Prod-App` (`40.192.27.248`) |
| `EC2_USER` | SSH user (`ubuntu`) |
| `EC2_SSH_KEY` | Base64-encoded dedicated ed25519 deploy private key |
