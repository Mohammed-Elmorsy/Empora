# Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test updates
- [ ] 🔧 Configuration change

## Related Issues

<!-- Link to related issues -->
Closes #(issue number)

## Changes Made

<!-- List the main changes made in this PR -->

-
-
-

## Testing

<!-- Describe the tests you ran and their results -->

### Test Coverage

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] Coverage is ≥ 80%

### Test Commands Run

```bash
# Backend
pnpm --filter backend test
pnpm --filter backend test:e2e
pnpm --filter backend test:cov

# Frontend
pnpm --filter frontend test
pnpm --filter frontend test:cov

# E2E
pnpm test:e2e
```

## Screenshots

<!-- If applicable, add screenshots to help explain your changes -->

## Checklist

<!-- Mark completed items with an "x" -->

### Before Review

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have written tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Test coverage is ≥ 80%
- [ ] I have followed TDD approach (tests written first)

### Code Quality

- [ ] Code has been linted (`pnpm lint`)
- [ ] Code has been formatted (`pnpm format`)
- [ ] No console.log or debugging code left in
- [ ] No TODO/FIXME comments (unless documented in issues)
- [ ] TypeScript types are properly defined (no `any` types unless necessary)

### Documentation

- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Inline code comments added for complex logic
- [ ] Architecture documentation updated (if needed)

### Security

- [ ] No sensitive data (API keys, passwords, etc.) in code
- [ ] Input validation implemented
- [ ] SQL injection prevention considered
- [ ] XSS prevention considered
- [ ] Authentication/Authorization properly implemented

### Database

- [ ] Database migrations created (if needed)
- [ ] Migrations tested locally
- [ ] Rollback strategy documented
- [ ] Data seeding updated (if needed)

### Performance

- [ ] No N+1 queries introduced
- [ ] Large datasets properly paginated
- [ ] Expensive operations optimized or cached
- [ ] Bundle size impact considered (frontend)

## Deployment Notes

<!-- Any special considerations for deployment -->

- [ ] Environment variables added/updated (document in .env.example)
- [ ] Database migration required
- [ ] Breaking changes require manual intervention
- [ ] Dependencies need to be installed

## Additional Context

<!-- Add any other context about the PR here -->

## Reviewer Checklist

<!-- For reviewers to complete -->

- [ ] Code review completed
- [ ] Tests reviewed and adequate
- [ ] Documentation reviewed
- [ ] Security considerations reviewed
- [ ] Performance implications considered
- [ ] Approved for merge

---

**TDD Compliance**: [ ] Tests were written before implementation (Red-Green-Refactor)
