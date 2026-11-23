# Thinkz AI — Live Studio (Jitsi & Jibri) Infrastructure Resources

**Region:** `ap-south-2` (Hyderabad)
**AWS Account ID:** `661609780373`
**Maintained By:** RK Reddy (DevOps Cloud Engineer)

---

## 1. Provisioned EC2 Instances

| Server Role | Instance Name | Instance ID | Instance Type | State | Public IP |
|---|---|---|---|---|---|
| **Jitsi Meet SFU** | `ThinkzAI-Jitsi` | `i-0c0a067392eb8bc71` | `t3.medium` | Running | `16.113.48.212` |
| **Jibri Recording Worker** | `ThinkzAI-Jibri` | `i-072cae9de3ed32bdd` | `t3.xlarge` | Running | `18.61.127.72` |

---

## 2. Network Ports & UFW Firewall (Verified Active)

| Port / Protocol | Source | Purpose |
|---|---|---|
| `80/TCP` | Anywhere | HTTP (ACME / HTTPS redirect) |
| `443/TCP` | Anywhere | HTTPS Web UI & XMPP signaling (`HTTP/2 200` verified) |
| `10000/UDP` | Anywhere | Jitsi Videobridge (JVB) WebRTC media streams |
| `4443/TCP` | Anywhere | Fallback media over TCP |
| `5222/TCP` | `172.31.0.50` only | XMPP control restricted to `ThinkzAI-Jibri` |

---

## 3. CloudWatch Monitoring, Colibri Stats & Logs

### Active Log Groups
- `/thinkz/prod/jitsi` — Jitsi Meet signaling & videobridge logs
- `/thinkzai/jibri/chromedriver` — Jibri ChromeDriver logs
- `/thinkzai/jibri/xorg` — Jibri virtual display logs

### Active Metrics & Alarms
- **CloudWatch Alarm:** `Thinkz-Jitsi-CPU-High` (>80% CPU for 5 min, State: `OK`)
- **JVB Colibri Stats:** Active at `http://127.0.0.1:8080/colibri/stats` (`0.0%` packet loss verified)

---

## 4. Jibri Recording → S3 Automation (Verified Active)

- **Jibri Health API:** `http://127.0.0.1:2222/jibri/api/v1.0/health` → `IDLE` / `HEALTHY`
- **IAM Role:** `ThinkzAI-Jibri-Role` (least-privilege scoped to S3 recordings bucket)
- **Finalize Hook:** `/usr/local/bin/thinkz-jibri-finalize.sh`
- **Automated S3 Sync:** `thinkz-jibri-s3-upload.timer` (active, runs every 15 min)
- **Verified Upload:** `rkjibritest_2026-11-09-11-45-41.mp4` (`111,086 bytes`) + SHA-256 verification marker confirmed in `/srv/recordings/`

---

## 5. Verification Checklist

| Item | Status |
|---|---|
| `ThinkzAI-Jitsi` (`t3.medium`) provisioned, all 5 services active & HTTPS `200` | Done |
| `ThinkzAI-Jibri` (`t3.xlarge`) provisioned, `IDLE` & `HEALTHY` | Done |
| UFW firewall configured (including `5222/TCP` locked to Jibri IP) | Done |
| CloudWatch Log Groups, CPU Alarm & JVB `/colibri/stats` active | Done |
| Jibri recording end-to-end MP4 upload to S3 with SHA-256 verification | Done |
| 10-concurrent-user signaling baseline load test (`infra/jitsi-load-test-baseline.md`) | Done (`53.4 ms` P95, `0%` errors) |
| Prosody JWT enforcement (`authentication = "token"`) | Waiting on backend JWT rollout (do not enable early to avoid locking rooms) |
| Custom domain (`live.thinkzai.com`) Route 53 A record + ACM SSL | Waiting on purchased domain confirmation |
