# Thinkz AI — Production Monitoring, Alerting & Backup Runbook

**Region:** `ap-south-2` (Hyderabad)
**Monitoring Stack:** AWS CloudWatch Agent + CloudWatch Logs + CloudWatch Alarms + Nginx JSON Metrics
**Owner:** RK Reddy (DevOps Cloud Engineer)

---

## 1. CloudWatch Log Groups

| Log Group | Source |
|---|---|
| `/thinkz/prod/api` | Production API application logs |
| `/thinkzai/prod/thinkz_backend` | Backend Docker container logs |
| `/thinkzai/prod/thinkz_postgres` | PostgreSQL container logs |
| `/thinkz/prod/jitsi` | Jitsi Meet Live Studio logs |
| `/thinkzai/jibri/chromedriver` | Jibri recording ChromeDriver logs |
| `/thinkzai/jibri/xorg` | Jibri virtual display (Xorg) logs |

---

## 2. CloudWatch Alarms & Thresholds

| Alarm Name | Metric / Condition | Severity | First Investigation Step |
|---|---|---|---|
| `ThinkzAI-Prod-EC2-CPU-High` | EC2 CPU > 80% (5 min) | P2 | Run `top` and `docker stats --no-stream` on `ThinkzAI-Prod-App` |
| `ThinkzAI-Prod-Memory-Usage-80` | EC2 Memory > 80% | P2 | Run `free -h` and `docker stats --no-stream` |
| `ThinkzAI-Prod-Disk-Usage-80` | Root EBS Disk > 80% | P2 | Run `df -h /` and `docker system df`; prune unused cache with `docker builder prune -af && docker image prune -af` |
| `ThinkzAI-Prod-Backend-5xx-Errors` | API HTTP 5xx spike | P1 | Check active container logs (`docker logs thinkz_backend_green --tail 100` or `thinkz_backend_blue`) and `/var/log/nginx/thinkz_api_metrics.log` |
| `ThinkzAI-Prod-Postgres-Connections-80` | PostgreSQL connections > 80% | P1 | Check active DB connections inside `thinkz_postgres` |
| `Thinkz-Jitsi-CPU-High` | Jitsi EC2 CPU > 80% (5 min) | P2 | SSH to `ThinkzAI-Jitsi` (`16.113.48.212`), inspect `jitsi-videobridge2` CPU & active rooms |

---

## 3. Quick Health & Diagnostic Commands (`ThinkzAI-Prod-App`)

```bash
# 1. Check active Blue-Green slot & running backend container
cat /etc/nginx/conf.d/00-thinkz-upstream.conf
docker ps --filter "name=thinkz_backend" --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"

# 2. Check live API health via HTTP & HTTPS
curl -s -o /dev/null -w "HTTP: %{http_code}\n" http://127.0.0.1/api/health
curl -sk -o /dev/null -w "HTTPS: %{http_code}\n" https://127.0.0.1/api/health

# 3. Check Nginx & CloudWatch agent status
sudo systemctl status nginx --no-pager
sudo systemctl status amazon-cloudwatch-agent --no-pager

# 4. Check disk space & memory
df -h /
free -h
```

---

## 4. Automated Database Backup & Restore Procedure

- **Schedule:** Daily at `02:00 UTC` via cron (`0 2 * * * /home/ubuntu/scripts/backup-db.sh`)
- **Backup Location:** `/opt/thinkz-ai/backups/postgres/` & `/home/ubuntu/backups/`
- **Verified Restore Test:** Restored dump into an isolated temporary PostgreSQL 16 container — **30 public tables verified cleanly**.

### Emergency Restore Steps (Isolated Verification First)
1. Locate the latest `.dump` file in `/opt/thinkz-ai/backups/postgres/`.
2. Restore into a temporary test container first to verify table count & data integrity.
3. Only after verification, schedule a maintenance window and restore to `thinkz_postgres`.

---

## 5. Escalation Matrix

| Severity | Description | Target Response | Contact |
|---|---|---|---|
| **P1 (Critical)** | Production API down / 5xx storm / DB unreachable | 15 min | DevOps On-Call (RK Reddy) + Backend Lead (Janadeep) |
| **P2 (High)** | Disk/CPU/Memory > 80%, Jitsi quality degradation | 1 hour | DevOps Cloud Engineer (RK Reddy) |
| **P3 (Medium)** | CI/CD build failure (live unaffected), non-critical warning | 4 hours | Module Owner + DevOps |
