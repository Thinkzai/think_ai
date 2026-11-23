# Thinkz AI — Production AWS Infrastructure Resources

**Region:** `ap-south-2` (Hyderabad)
**AWS Account ID:** `661609780373`
**Maintained By:** RK Reddy (DevOps Cloud Engineer)

---

## 1. EC2 Compute Instances

| Name | Instance ID | Type | State | Public IP | Purpose |
|---|---|---|---|---|---|
| `ThinkzAI-Prod-App` | `i-053c4692b74732e55` | `t3.micro` | Running | `40.192.27.248` | Main Production API (Docker Blue-Green), PostgreSQL, Nginx |
| `ThinkzAI-Jitsi` | `i-0c0a067392eb8bc71` | `t3.medium` | Running | `16.113.48.212` | Live Studio Jitsi Meet Server |
| `ThinkzAI-Jibri` | `i-072cae9de3ed32bdd` | `t3.xlarge` | Running | `18.61.127.72` | Jitsi Recording (Jibri) Worker |
| `thinkz-judge0-2204` | `i-0b15369fe0cfa414e` | `t3.medium` | Running | `18.60.117.165` | Code Execution Sandbox (Judge0) |
| `chatbot-production` | `i-09b9b15ac6d3e346e` | `t3.large` | Running | `18.61.61.192` | AI Chatbot Service |

---

## 2. Container Registry (AWS ECR)

- **Repository:** `661609780373.dkr.ecr.ap-south-2.amazonaws.com/thinkz-prod-api`
- **Base Image:** `node:20-alpine` (multi-stage build, `< 400 MB`, non-root runtime user `appuser`)
- **Tag Format:** `<git-sha>-<github-run-id>-<run-attempt>`

---

## 3. IAM Roles

- **EC2 Operations Role:** `arn:aws:iam::661609780373:role/ThinkzAI-EC2-Operations-Role`
  - Attached to `ThinkzAI-Prod-App` for ECR image pull, CloudWatch agent logging, and SSM access.
- **GitHub OIDC ECR Push Role:** `arn:aws:iam::661609780373:role/ThinkzAI-GitHub-ECR-Push`
  - Assumed via GitHub Actions OIDC (`id-token: write`) for keyless AWS ECR image publishing.

---

## 4. Networking, Reverse Proxy & SSL

- **Reverse Proxy:** Nginx on `ThinkzAI-Prod-App` (ports `80` HTTP and `443` HTTPS)
- **SSL/TLS:** Let's Encrypt certificate on `40.192.27.248` (TLS 1.2 & TLS 1.3)
- **Blue-Green Upstream Config:** `/etc/nginx/conf.d/00-thinkz-upstream.conf`
  - Blue slot: `127.0.0.1:5000` (`thinkz_backend_blue`)
  - Green slot: `127.0.0.1:5001` (`thinkz_backend_green`)
- **Rate Limiting:** `10 req/s` per IP for API endpoints (`thinkz_api_limit`), `100 req/s` for static assets (`thinkz_static_limit`)
- **Security Headers:** HSTS, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, CSP (`frame-ancestors 'self'`)
- **DNS / Custom Domain Status:** Currently serving HTTPS via Elastic IP (`https://40.192.27.248`); Route 53 A records + ACM domain certificate will be mapped once the client domain is finalized.

---

## 5. Database & Automated Backups

- **Database:** PostgreSQL 16 (`thinkz_postgres` on Docker network `thinkz_network`)
- **Automated Daily Backup:** Cron job at `02:00 UTC` daily (`/home/ubuntu/scripts/backup-db.sh`)
- **Backup Storage:** `/opt/thinkz-ai/backups/postgres/` & `/home/ubuntu/backups/`
- **Restore Verification:** Tested end-to-end into an isolated temporary PostgreSQL container (30 tables verified).

---

## 6. Storage & Capacity (`ThinkzAI-Prod-App`)

- **Root EBS Volume:** `29 GB` (`53%` used / `14 GB` available as of Nov 23, 2026)
- **AWS SSM Agent:** Active
