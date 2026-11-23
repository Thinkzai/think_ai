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

## 2. Required Network Ports (Jitsi Security Group)

| Port / Protocol | Purpose |
|---|---|
| `80/TCP` | HTTP (ACME / HTTPS redirect) |
| `443/TCP` | HTTPS Web UI & XMPP signaling |
| `10000/UDP` | Jitsi Videobridge (JVB) WebRTC media streams |
| `4443/TCP` | Fallback media over TCP |

---

## 3. CloudWatch Monitoring & Logs

### Active Log Groups
- `/thinkz/prod/jitsi` — Jitsi Meet signaling & videobridge logs
- `/thinkzai/jibri/chromedriver` — Jibri ChromeDriver logs
- `/thinkzai/jibri/xorg` — Jibri virtual display logs

### Active CloudWatch Alarm
- **`Thinkz-Jitsi-CPU-High`** — Alerts when `ThinkzAI-Jitsi` CPU exceeds 80% for 5 minutes (State: `OK`).

---

## 4. Verification & Pending Sign-Off Checklist

| Item | Status |
|---|---|
| `ThinkzAI-Jitsi` (`t3.medium`) provisioned & running | Done |
| `ThinkzAI-Jibri` (`t3.xlarge`) provisioned & running | Done |
| CloudWatch Log Groups (`/thinkz/prod/jitsi`, Jibri logs) active | Done |
| CloudWatch Alarm (`Thinkz-Jitsi-CPU-High`) active | Done |
| Backend-generated JWT verification & Prosody JWT enforcement | Pending final backend PR & rollout |
| Jibri recording end-to-end MP4 upload to S3 verification | Pending QA test session |
| 10-concurrent-user 15-minute baseline load test | Pending scheduling |
| Custom domain (`live.thinkzai.com`) Route 53 A record + ACM SSL | Pending final domain confirmation |
