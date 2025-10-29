# Empora Deployment Guide

## Overview

Empora uses a modern deployment strategy with separate environments for development, staging, and production.

## Environments

| Environment | Purpose | URL | Auto-Deploy |
|-------------|---------|-----|-------------|
| Development | Local development | localhost | N/A |
| Staging | Pre-production testing | staging.empora.com | ✅ (main branch) |
| Production | Live application | empora.com | Manual approval |

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     GitHub Repository                    │
│                                                          │
│  main branch → Triggers CI/CD → Staging                 │
│  release tag → Approval → Production                    │
└─────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions                        │
│                                                          │
│  1. Run Tests (Unit + Integration + E2E)                │
│  2. Build Applications                                   │
│  3. Run Security Scans                                   │
│  4. Deploy to Environment                                │
└─────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────┐         ┌──────────────────┐
│   Frontend       │         │    Backend       │
│   (Vercel)       │         │   (Railway/AWS)  │
│                  │         │                  │
│   - CDN          │         │   - API Server   │
│   - SSR          │         │   - Database     │
│   - Edge         │         │   - Redis        │
└──────────────────┘         └──────────────────┘
```

## Pre-Deployment Checklist

Before deploying to any environment:

- ✅ All tests pass locally
- ✅ Coverage ≥ 80%
- ✅ No linting errors
- ✅ Environment variables configured
- ✅ Database migrations ready
- ✅ Documentation updated
- ✅ Security audit completed

## Frontend Deployment (Vercel)

### Initial Setup

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import GitHub repository
   - Select `apps/frontend` as root directory

2. **Configure Build Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: apps/frontend
   Build Command: pnpm build
   Output Directory: .next
   Install Command: cd ../.. && pnpm install --frozen-lockfile
   ```

3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://api.empora.com/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```

### Deployment Process

**Staging** (automatic):
```bash
git push origin main
# Vercel automatically deploys to staging
```

**Production** (manual):
```bash
# Create production deployment
vercel --prod

# Or promote staging to production in Vercel dashboard
```

### Custom Domain Setup

1. Add domain in Vercel dashboard
2. Configure DNS:
   ```
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```
3. Enable SSL (automatic)

## Backend Deployment

### Option 1: Railway

#### Initial Setup

1. **Create New Project**:
   ```bash
   railway login
   railway init
   ```

2. **Configure Service**:
   ```bash
   railway add
   # Select PostgreSQL
   # Select Redis
   ```

3. **Set Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   railway variables set DATABASE_URL=${{DATABASE_URL}}
   railway variables set REDIS_URL=${{REDIS_URL}}
   railway variables set JWT_SECRET=your-secure-secret
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

### Option 2: AWS (Recommended for Production)

#### Architecture

```
Load Balancer (ALB)
       ↓
ECS Fargate (API)
       ↓
   ┌───────┬────────┐
   RDS     Redis    S3
```

#### Setup Steps

1. **Create ECR Repository**:
   ```bash
   aws ecr create-repository --repository-name empora-backend
   ```

2. **Build and Push Docker Image**:
   ```bash
   # Build
   docker build -t empora-backend apps/backend

   # Tag
   docker tag empora-backend:latest \
     xxx.dkr.ecr.us-east-1.amazonaws.com/empora-backend:latest

   # Push
   docker push xxx.dkr.ecr.us-east-1.amazonaws.com/empora-backend:latest
   ```

3. **Create ECS Task Definition**:
   ```json
   {
     "family": "empora-backend",
     "containerDefinitions": [{
       "name": "api",
       "image": "xxx.dkr.ecr.us-east-1.amazonaws.com/empora-backend:latest",
       "portMappings": [{
         "containerPort": 3001,
         "protocol": "tcp"
       }],
       "environment": [
         {"name": "NODE_ENV", "value": "production"}
       ],
       "secrets": [
         {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:..."}
       ]
     }]
   }
   ```

4. **Create ECS Service**:
   ```bash
   aws ecs create-service \
     --cluster empora \
     --service-name backend \
     --task-definition empora-backend \
     --desired-count 2 \
     --launch-type FARGATE
   ```

## Database Migrations

### Staging

Automatically run on deployment:
```yaml
# In GitHub Actions
- name: Run Migrations
  run: |
    cd apps/backend
    npx prisma migrate deploy
```

### Production

**Always test in staging first!**

```bash
# 1. Create backup
pg_dump $DATABASE_URL > backup.sql

# 2. Run migration
cd apps/backend
DATABASE_URL=$PROD_DATABASE_URL npx prisma migrate deploy

# 3. Verify
psql $PROD_DATABASE_URL -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;"

# 4. If issues, rollback
psql $PROD_DATABASE_URL < backup.sql
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy to Staging

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Environment Variables

### Required Variables

#### Frontend
```env
# API
NEXT_PUBLIC_API_URL=https://api.empora.com/api/v1

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Backend
```env
# Application
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_HOST=redis.host.com
REDIS_PORT=6379
REDIS_PASSWORD=xxx

# JWT
JWT_SECRET=your-super-secure-secret-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=https://empora.com

# Stripe
STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
EMAIL_FROM=noreply@empora.com
EMAIL_API_KEY=your-email-provider-key

# AWS S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=empora-uploads
```

### Secrets Management

1. **Development**: `.env` files (gitignored)
2. **Staging/Production**:
   - Vercel: Environment Variables UI
   - Railway: CLI or Dashboard
   - AWS: Secrets Manager or Parameter Store

## Monitoring & Logging

### Application Monitoring

**Sentry** (Error Tracking):
```bash
# Install
pnpm add @sentry/nextjs @sentry/node

# Configure
SENTRY_DSN=https://xxx@sentry.io/xxx
```

**PostHog** (Analytics):
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Infrastructure Monitoring

- **Uptime**: Uptime Robot or Pingdom
- **Performance**: Vercel Analytics, DataDog
- **Logs**: Papertrail, CloudWatch Logs

## SSL/TLS

- **Frontend**: Automatic via Vercel
- **Backend**:
  - Railway: Automatic
  - AWS: ACM Certificate + ALB

## Backup Strategy

### Database Backups

```bash
# Daily automated backups
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql.gz s3://empora-backups/
```

### Retention Policy

- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

## Rollback Procedure

If deployment fails:

1. **Identify Issue**:
   ```bash
   # Check logs
   railway logs
   # Or
   aws logs tail /ecs/empora-backend
   ```

2. **Rollback Frontend**:
   ```bash
   # In Vercel dashboard, revert to previous deployment
   # Or via CLI
   vercel rollback [deployment-url]
   ```

3. **Rollback Backend**:
   ```bash
   # Railway
   railway rollback

   # AWS ECS
   aws ecs update-service \
     --cluster empora \
     --service backend \
     --task-definition empora-backend:previous-version
   ```

4. **Rollback Database** (if migrations ran):
   ```bash
   psql $DATABASE_URL < backup-before-deploy.sql
   ```

## Performance Optimization

### Frontend

1. **Enable Caching**: CDN caching via Vercel
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Automatic with Next.js
4. **Compression**: Gzip/Brotli enabled

### Backend

1. **Connection Pooling**: Prisma connection pool
2. **Redis Caching**: Cache frequent queries
3. **Horizontal Scaling**: Multiple instances
4. **Database Optimization**: Indexed queries

## Security

### Pre-Deployment Security Checks

```bash
# Audit dependencies
pnpm audit

# Check for secrets
git secrets --scan

# Run security linter
pnpm eslint:security
```

### Production Security

1. **Rate Limiting**: Enabled on all endpoints
2. **CORS**: Configured for frontend domain only
3. **Headers**: Security headers via middleware
4. **Secrets**: Never in code, use secret managers
5. **Updates**: Regular dependency updates

## Cost Optimization

### Vercel

- **Hobby**: Free (good for staging)
- **Pro**: $20/month (production)

### Railway

- **Developer**: $5/month
- **Team**: $20/month + usage

### AWS

- **RDS**: ~$50/month (db.t3.small)
- **ECS Fargate**: ~$30/month (2 tasks)
- **ALB**: ~$20/month
- **Total**: ~$100-150/month

## Troubleshooting

### Common Issues

**Build Fails**:
```bash
# Clear cache
rm -rf node_modules .next dist
pnpm install
```

**Database Connection**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Env Variables Missing**:
```bash
# List all variables
railway variables
# Or check Vercel dashboard
```

## Support & Maintenance

- **Uptime Target**: 99.9%
- **Backup Frequency**: Daily
- **Monitoring**: 24/7
- **Updates**: Weekly dependency updates
- **Security Patches**: Within 24 hours
