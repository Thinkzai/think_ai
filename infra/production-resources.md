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
- Administration: AWS Systems Manager Session Manager
- Public inbound ports: HTTP 80 and HTTPS 443
- Public SSH port 22: Removed

## Application

- Project directory: /opt/thinkz-ai
- GitHub repository: Thinkzai/think_ai
- Deployment branch: thinkz-ai-ec2-deployment
- Deployment method: GitHub Actions, Amazon ECR and AWS SSM
- Frontend container: thinkz_frontend
- Backend container: thinkz_backend
- Database container: thinkz_postgres

## Amazon ECR

- Backend repository: thinkz-ai-backend
- Frontend repository: thinkz-ai-frontend
- Image scanning on push: Enabled
- Image tags: Git commit SHA and latest

## IAM and Deployment

- GitHub Actions role: ThinkzAI-GitHub-Actions-Role
- Authentication: GitHub OIDC
- Long-lived AWS access keys in GitHub: Not used
- EC2 role: ThinkzAI-EC2-CloudWatch-Role
- Remote deployment: AWS SSM Run Command
- Deployment script: scripts/deploy-ecr.sh
- Health verification: Enabled
- Rollback verification: Passed

## Monitoring

- CloudWatch log retention: 30 days
- CloudWatch alarms: Configured
- SNS email notifications: Confirmed
- CloudWatch dashboard: ThinkzAI-Infrastructure
- Container health checks: Enabled

## PostgreSQL Backup

- Database engine: PostgreSQL 16 Alpine in Docker
- Backup schedule: Daily at 02:00 UTC
- Backup script: postgres-backup.sh
- S3 bucket: thinkz-ai-rk-backups-114757333589
- S3 prefix: postgresql-backups/
- S3 versioning: Enabled
- Encryption: AES256
- Current backup retention: 90 days
- Noncurrent version retention: 30 days
- Restore test: Passed with 5 public tables

## Current Production Status

- Frontend: Healthy
- Backend: Healthy
- PostgreSQL: Healthy
- Website response: HTTP 200
- API response: HTTP 200
- CI/CD deployment: Passed
- Manual rollback and restoration: Passed

## External Dependencies

- Domain, DNS and trusted HTTPS: Pending because domain information was not provided
- Amazon RDS: Not implemented because approval and budget were not provided

## Final Status

All approved and domain-independent DevOps work is complete and verified.
