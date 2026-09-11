# Thinkz AI Monitoring and Incident Runbook

## Owner

- Name: RK Reddy
- Role: DevOps Cloud Engineer
- Environment: AWS production
- Region: ap-south-2

## Monitoring Components

- Amazon CloudWatch Logs for backend and frontend
- Log retention: 30 days
- CloudWatch infrastructure dashboard
- CPU and status-check alarms
- Amazon SNS email notifications
- Docker health checks
- Website and API HTTP checks

## Normal Health Verification

Run from an SSM Session Manager terminal:

```bash
sudo bash -lc "cd /opt/thinkz-ai && docker compose ps"
curl -sS -o /dev/null -w "Website HTTP=%{http_code}\\n" http://localhost/
curl -sS -o /dev/null -w "API HTTP=%{http_code}\\n" http://localhost/api/courses
```

Expected results:

- Backend: healthy
- Frontend: healthy
- PostgreSQL: healthy
- Website: HTTP 200
- API: HTTP 200

## Incident Severity

- P1 Critical: Website unavailable, database unavailable or deployment failure
- P2 High: Repeated 5xx errors, unhealthy container or sustained high CPU
- P3 Medium: Delayed backup, warning alert or intermittent error
- P4 Low: Documentation, optimization or non-production issue

## Investigation Procedure

1. Open the EC2 instance using SSM Session Manager.
2. Check containers with `docker compose ps`.
3. Check recent logs with `docker compose logs --tail=100 backend frontend`.
4. Test the website and API locally with curl.
5. Check the CloudWatch dashboard and alarm history.
6. Check the latest GitHub Actions workflow result.
7. Record the time, error and action taken.

## Deployment Failure

1. Open the failed GitHub Actions job.
2. Review the failed workflow step.
3. Check the SSM command output.
4. Verify ECR images exist for the commit SHA.
5. Check EC2 container logs.
6. Use the previous verified image SHA if rollback is required.
7. Confirm all services are healthy and return HTTP 200.

## Database and Backup Verification

- Backup script: `/opt/thinkz-ai/postgres-backup.sh`
- Schedule: Daily at 02:00 UTC
- S3 bucket: `thinkz-ai-rk-backups-114757333589`
- Prefix: `postgresql-backups/`
- Encryption: AES256
- Current-version retention: 90 days
- Noncurrent-version retention: 30 days

Verification commands:

```bash
sudo tail -50 /opt/thinkz-ai/backups/backup.log
aws s3 ls s3://thinkz-ai-rk-backups-114757333589/postgresql-backups/ --recursive
```

A backup restore was tested successfully in an isolated database and produced five public tables.

## Alert Response

1. Confirm whether the alarm is currently active.
2. Check CPU, instance status and container health.
3. Review CloudWatch and Docker logs.
4. Correct the identified issue.
5. Verify website and API HTTP 200 responses.
6. Confirm the CloudWatch alarm returns to OK.
7. Record the incident and resolution.

## Secure Administration

- Use AWS Systems Manager Session Manager.
- Do not reopen public SSH port 22.
- Do not expose PostgreSQL port 5432 publicly.
- Do not store AWS access keys in source control.
- Do not print application secrets in logs or reports.

## Escalation

Escalate to the team lead when:

- Production remains unavailable after rollback.
- Data corruption or data loss is suspected.
- IAM permissions must be expanded.
- A change could increase AWS cost.
- A domain, certificate, RDS or client approval is required.

## Current Verified Status

- Application containers: Healthy
- Website: HTTP 200
- API: HTTP 200
- CI/CD: Passed
- Rollback test: Passed
- Backup upload: Passed
- Backup restore: Passed
- SSM administration: Passed
