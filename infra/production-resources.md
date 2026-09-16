# Thinkz AI Production Resources

## Owner

- Name: RK Reddy
- Role: DevOps Cloud Engineer
- AWS Account: 114757333589
- Region: ap-south-2
- Availability Zone: ap-south-2b

## EC2

- Instance name: Thinkz-AI-Server
- Instance ID: i-02fe2f396176b851a
- Instance type: t3.micro
- Private IP: 172.31.37.18
- Public IP: 18.60.237.235
- Security group: sg-0adb9984fc1dd4424
- Administration: AWS Systems Manager
- Application HTTP port: 80
- Backend port 5000: Docker internal only
- PostgreSQL port 5432: Docker internal only

## Application

- Project directory: /opt/thinkz-ai
- GitHub repository: Thinkzai/think_ai
- Deployment branch: thinkz-ai-ec2-deployment
- Frontend container: thinkz_frontend
- Backend container: thinkz_backend
- Database container: thinkz_postgres
- Frontend reverse proxy: Nginx
- API upstream: backend:5000
- Socket.IO upstream: backend:5000

## Amazon ECR

- Backend repository: thinkz-ai-backend
- Frontend repository: thinkz-ai-frontend
- Backend release tag: v1.0.0-client-release
- Verified optimized backend local image size: 366 MB
- Backend release push: Verified

## CI/CD

- Workflow: .github/workflows/deploy-prod.yml
- Authentication: GitHub OIDC
- Long-lived GitHub AWS access keys: Not used
- Remote deployment: AWS SSM
- Deployment script: scripts/deploy-ecr.sh
- Frontend lint validation: Configured
- Frontend unit-test validation: Configured
- Frontend build validation: Configured
- Container health verification: Configured
- PostgreSQL health verification: Configured
- Website/API/Nginx verification: Configured
- Socket.IO smoke verification: Configured
- Automatic rollback: Configured

Workflow/deployment-script improvements are local modifications until approved Git commit/push.

Controlled backend Blue-Green production switching was successfully tested on 16 September 2026.

## Monitoring

- CloudWatch dashboard: ThinkzAI-Infrastructure
- Backend/frontend log retention: 30 days
- CloudWatch Agent: Enabled
- CPU alarm: OK
- Memory alarm: OK
- EC2 status alarm: OK
- Backend 5xx alarm: OK
- SNS topic: ThinkzAI-Infrastructure-Alerts
- SNS email subscription: Confirmed

## S3 Production Media

- Bucket: client-learning-media-prod
- Region: ap-south-2
- Versioning: Enabled
- Lifecycle: STANDARD_IA after 90 days
- Current objects: None

## PostgreSQL Backup

- Engine: PostgreSQL 16 Alpine in Docker
- Schedule: Daily at 02:00 UTC
- Backup bucket: thinkz-ai-rk-backups-114757333589
- Prefix: postgresql-backups/
- Versioning: Enabled
- Latest checksum validation: Passed
- Latest pg_restore readability: Passed
- Historical isolated restore: Passed

## Current Production Status

- Frontend: Healthy
- Backend: Healthy
- PostgreSQL: Healthy
- Website: HTTP 200
- API: HTTP 200
- Socket.IO Nginx path: Passed
- Backend RestartCount: 0

## Resource Constraint Observed

During final CI/CD inspection:

- EC2 memory available: approximately 296 MiB
- Swap already in use
- Root filesystem usage: 83%

A controlled backend Blue-Green production test was subsequently performed on 16 September 2026 and passed.

## Excluded Scope

- Domain
- Route53
- ACM/trusted HTTPS
- Elastic-IP/domain cutover work
- Amazon RDS migration

These items are not included in the current completion statement.

## Blue-Green Production Status - 16 September 2026

A team-lead-approved controlled backend Blue-Green production test has now been completed.

Verified:

- Parallel Blue and Green backend containers: Passed.
- Blue -> Green traffic switch: Passed.
- Green -> Blue rollback: Passed.
- Zero observed failed HTTP samples during switch: 80/80 successful.
- Zero observed failed HTTP samples during rollback: 80/80 successful.
- Socket.IO validation: Passed.
- Final website health: HTTP 200.
- Final API health: HTTP 200.
- Container restart counts during final verification: 0.

Current production API/Socket.IO backend:

`thinkz_backend_green:5000`

Blue remains available as the rollback backend.

### Architecture Note

The production `thinkz_frontend` Nginx container remains the stable public ingress on port 80.

The completed Blue-Green verification applies to backend API and Socket.IO upstream switching. A complete frontend-container Blue-Green architecture would require an independent stable ingress in front of separate Blue and Green frontend containers.
