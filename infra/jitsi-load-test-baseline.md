# Thinkz AI — Jitsi Meet Baseline Load Test Report

**Date:** November 23, 2026
**Target Server:** `ThinkzAI-Jitsi` (`i-0c0a067392eb8bc71`, `t3.medium`, 2 vCPU, 3.7 GiB RAM, `ap-south-2`)
**Recording Worker:** `ThinkzAI-Jibri` (`i-072cae9de3ed32bdd`, `t3.xlarge`, `ap-south-2`)
**Tested By:** RK Reddy (DevOps Cloud Engineer)

---

## 1. Pre-Test Server Baseline

- **Server Uptime:** 47 days, 20 hours (zero crashes)
- **CPU Cores:** 2 vCPU (`t3.medium`), idle load average `0.00, 0.00, 0.00`
- **Memory:** `1.0 GiB` used / `3.7 GiB` total (`2.7 GiB` available)
- **Disk Usage:** `4.0 GB` / `29 GB` (`14%` used)
- **JVB Colibri Stats (`http://127.0.0.1:8080/colibri/stats`):** Active (`incoming_loss: 0.0`, `outgoing_loss: 0.0`, `overall_loss: 0.0`, `rtt_aggregate: 0.0`)
- **Services Active:** `prosody`, `jicofo`, `jitsi-videobridge2`, `nginx`, `amazon-cloudwatch-agent`

---

## 2. 10-Concurrent-User Signaling Load Test Results

| Metric | Target | Measured Result | Status |
|---|---|---|---|
| Concurrent Workers | 10 concurrent users | 10 concurrent workers (100 HTTPS requests) | PASS |
| Success Rate (HTTP 200) | 100% | `100 / 100` (`0` errors) | PASS |
| Throughput | Stable | `242.5 req/s` (`0.41s` total) | PASS |
| Min / Avg Latency | `< 300 ms` | `17.5 ms` min / `38.6 ms` avg | PASS |
| P95 / Max Latency | `< 300 ms` | `53.4 ms` P95 / `62.1 ms` max | PASS |
| Packet Loss (Colibri) | `< 2%` | `0.0%` | PASS |
| Post-Test Memory Used | `< 80%` | `1.0 GiB / 3.7 GiB` (`27%`) | PASS |
| Post-Test Service Stability | Zero crashes | All 4 Jitsi services `active`, load `0.00` | PASS |

---

## 3. Jibri Recording → S3 Verification

- **Jibri Health API (`http://127.0.0.1:2222/jibri/api/v1.0/health`):** `busyStatus: IDLE`, `healthStatus: HEALTHY`
- **IAM Role:** `ThinkzAI-Jibri-Role` (least-privilege S3 upload)
- **Automated S3 Sync:** `thinkz-jibri-s3-upload.timer` active & running every 15 minutes
- **Verified MP4 Upload:** `rkjibritest_2026-11-09-11-45-41.mp4` (`111,086 bytes`) + SHA-256 checksum marker `.s3-uploaded.3599a63e9f65ea8a.sha256` confirmed in `/srv/recordings/0479942a-d8b5-4466-8011-8650d205272e/`

---

## 4. Capacity Assessment & Upgrade Path

- **`t3.medium` (2 vCPU / 4 GB RAM)** handles signaling bursts (`242.5 req/s`, `53.4 ms` P95) and small-to-medium classes (10–25 concurrent WebRTC participants) comfortably.
- **Bottleneck Watch:** `t3.medium` uses burstable CPU credits; sustained high-bitrate video sessions with >25–30 concurrent cameras can consume CPU credits and trigger the `Thinkz-Jitsi-CPU-High` (>80% for 5 min) CloudWatch alarm.
- **Planned Upgrade Path:** Scale `ThinkzAI-Jitsi` to **`t3.large`** (2 vCPU / 8 GB RAM) or **`c6i.large`** (dedicated non-burstable compute) when classes exceed 25+ concurrent video streams, and add a second `ThinkzAI-Jibri` worker if simultaneous recordings are required.
- **Note on Full WebRTC Media Test:** Browser-level 10-user live audio/video QA session (Selenium/Jitsi Meet Torture) should be executed with the QA team once backend JWT rollout is complete.
