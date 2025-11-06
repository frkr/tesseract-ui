# Best Practices Templates for .github Directory

This document contains production-ready templates for all files in your GitHub repository structure.

---

## 1. `.github/ISSUE_TEMPLATE/config.yml`

```yaml
# Issue template configuration
# Controls issue creation behavior and provides contact links

blank_issues_enabled: false

contact_links:
  - name: GitHub Discussions
    url: https://github.com/YOUR_ORG/YOUR_REPO/discussions
    about: Ask questions, share ideas, and discuss with the community

  - name: Documentation
    url: https://docs.example.com
    about: Read our comprehensive documentation for guides and tutorials

  - name: Stack Overflow
    url: https://stackoverflow.com/questions/tagged/YOUR_PROJECT
    about: Search for solutions on Stack Overflow

  - name: Security Issues
    url: https://github.com/YOUR_ORG/YOUR_REPO/security/advisories
    about: Report security vulnerabilities responsibly
```

**Best Practices:**
- Set `blank_issues_enabled: false` to force template usage
- Provide 3-5 contact links for different issue types
- Include links to documentation, discussions, and security reporting
- Use clear, action-oriented descriptions (start with verbs like "Ask", "Read", "Report")

---

## 2. `.github/ISSUE_TEMPLATE/01-bug_report.yml`

```yaml
name: 🐛 Bug Report
description: Report a bug to help us improve the project
title: "[BUG] "
labels: ["bug", "triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        Thank you for taking the time to report this bug! 🙏
        
        Please provide as much detail as possible to help us understand and reproduce the issue.

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Clearly describe the bug you encountered
      placeholder: "When I tried to [action], [unexpected behavior] happened instead of [expected behavior]"
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Provide exact steps to reproduce the bug
      placeholder: |
        1. Go to [location]
        2. Click on [element]
        3. Enter [data]
        4. Observe [behavior]
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What should happen instead?
      placeholder: "The system should..."
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happens?
      placeholder: "Instead, the system..."
    validations:
      required: true

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: How critical is this bug?
      options:
        - "🟢 Low (cosmetic issue, workaround available)"
        - "🟡 Medium (affects functionality, no easy workaround)"
        - "🔴 High (major functionality broken)"
        - "🔴🔴 Critical (system unusable or data loss)"
    validations:
      required: true

  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Provide relevant system information
      placeholder: |
        - OS: [e.g., macOS 14.1, Windows 11, Ubuntu 23.10]
        - Browser: [e.g., Chrome 119, Firefox 121]
        - Node.js/Runtime: [version]
        - Project Version: [version]
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Error Logs / Screenshots
      description: Include error messages, stack traces, or screenshots
      placeholder: "Paste error output here or attach screenshots"

  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Any other context that might be helpful?
      placeholder: "I noticed this started happening after version X..."

  - type: checkboxes
    id: verification
    attributes:
      label: Verification
      description: Please verify before submitting
      options:
        - label: I have searched existing issues and this is not a duplicate
          required: true
        - label: I can reproduce this bug consistently
          required: true
        - label: I have provided all relevant information
          required: true
```

**Best Practices:**
- Use emojis for visual hierarchy (🐛 for bugs, etc.)
- Keep critical fields required but mark others as optional
- Provide placeholders that demonstrate what you need
- Include severity levels to help with triage
- Add verification checkboxes to ensure quality
- Ask for environment details to aid debugging

---

## 3. `.github/ISSUE_TEMPLATE/02-feature_request.md`

```markdown
---
name: ✨ Feature Request
about: Suggest a new feature or enhancement
title: "[FEATURE] "
labels: ["enhancement", "triage"]
assignees: []
---

## Description

<!-- Clearly describe the feature you would like to see -->

## Use Case

<!-- Explain the problem this feature would solve or the benefit it would provide -->

## Proposed Solution

<!-- Describe how you envision this feature working -->

## Alternatives Considered

<!-- What other approaches have you considered? -->
- Alternative 1: ...
- Alternative 2: ...

## Additional Context

<!-- Add any other relevant context, mockups, or examples -->

## Screenshots / Mockups

<!-- If applicable, add visual examples -->

---

### Before Submitting

- [ ] I have searched for existing feature requests and this is not a duplicate
- [ ] This feature aligns with the project's goals and scope
- [ ] I have provided a clear use case and value proposition
```

**Best Practices:**
- Use markdown frontmatter for simpler template structure
- Include "Use Case" to establish value
- Ask for alternatives considered to show thoughtfulness
- Add mockup section for UI/UX features
- Use checkboxes for contributor verification

---

## 4. `.github/ISSUE_TEMPLATE/03-documentation.md`

```markdown
---
name: 📚 Documentation Issue
about: Suggest documentation improvements
title: "[DOCS] "
labels: ["documentation", "triage"]
assignees: []
---

## What needs documentation?

<!-- Describe what topic or feature needs documentation or clarification -->

## Current State

<!-- What documentation exists currently (if any)? Is it incomplete, unclear, or outdated? -->

## Suggested Improvement

<!-- How should this be documented? -->

## Additional Resources

<!-- Link to related code, issues, or external references -->

## Severity

- [ ] Critical (documentation is missing for released feature)
- [ ] High (documentation is unclear or outdated)
- [ ] Medium (documentation could be enhanced)
- [ ] Low (minor improvements or nice-to-have)

---

### Before Submitting

- [ ] I have checked if documentation for this already exists
- [ ] I have provided specific examples of what needs improvement
```

**Best Practices:**
- Focus on documentation gaps specifically
- Ask about current state to understand context
- Provide severity indicators for prioritization
- Include links to related resources
- Keep simpler than bug reports for faster processing

---

## 5. `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`

```markdown
## Description

<!-- Provide a brief summary of the changes in this PR -->
<!-- What problem does this solve? What feature does it add? -->

### Related Issues

Fixes #(issue number)
Related to #(issue number)

### Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] ♻️ Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test update

## How to Test

<!-- Provide clear steps to review and test the changes -->
1. 
2. 
3. 

## Test Coverage

- [ ] Added/updated unit tests
- [ ] Added/updated integration tests
- [ ] Manual testing performed

## Checklist

### Code Quality
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented complex logic, especially around "why" not "what"
- [ ] I have updated relevant documentation
- [ ] No new warnings have been generated

### Testing
- [ ] My changes generate no new test failures
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] Tests pass locally with my changes

### Dependencies
- [ ] I have not added any unnecessary dependencies
- [ ] I have updated `package.json` / `requirements.txt` / etc. if needed
- [ ] Dependency versions are compatible with the project

### Performance & Security
- [ ] I have not negatively impacted performance
- [ ] I have not introduced any security vulnerabilities
- [ ] I have considered accessibility implications

## Screenshots (if applicable)

<!-- Add screenshots or gifs showing the UI changes -->

## Additional Context

<!-- Any additional information that reviewers should know -->

## Reviewer Notes

<!-- Optional: Any specific areas you'd like reviewers to focus on -->
```

**Best Practices:**
- Use checkboxes for clear verification
- Include related issues references
- Request specific types of testing
- Add performance and security considerations
- Include screenshots for UI changes
- Allow optional reviewer notes

---

## 6. `.github/PULL_REQUEST_TEMPLATE/bug_fix_template.md`

```markdown
## Bug Description

<!-- What bug does this PR fix? Reference the issue number. -->

Fixes #(issue number)

## Root Cause

<!-- Explain why this bug occurred and what causes it -->

## Solution

<!-- Describe your fix and why it works -->

## Testing

<!-- How was this fix validated? Include reproduction steps. -->

1. 
2. 
3. 

## Before/After

<!-- If applicable, show before and after behavior -->

**Before:**
```
// or screenshot
```

**After:**
```
// or screenshot
```

## Checklist

- [ ] Bug is reproduced and confirmed fixed
- [ ] Fix does not introduce regressions
- [ ] Added/updated relevant tests
- [ ] Updated documentation if needed
- [ ] Changes are minimal and focused on the bug
- [ ] No new warnings or errors introduced

## Risk Assessment

**Risk Level:** 🟢 Low / 🟡 Medium / 🔴 High

**Reason:** <!-- Explain the risk level -->

**Areas affected:**
- 
- 

**Potential side effects:**
- 
-
```

**Best Practices:**
- Emphasize root cause explanation
- Include before/after demonstration
- Add risk assessment for impact analysis
- List affected areas and side effects
- Focus on minimal, targeted changes

---

## 7. `.github/PULL_REQUEST_TEMPLATE/feature_template.md`

```markdown
## Feature Description

<!-- Clearly describe the new feature or enhancement -->

### Related Issue

Relates to #(issue number)

## Motivation

<!-- Why is this feature needed? What problem does it solve? -->

## Implementation Details

<!-- How does this feature work? Explain the technical approach. -->

### Architecture Changes

<!-- If applicable, describe any architectural changes -->

### API Changes

<!-- If applicable, document new/changed APIs -->

```typescript
// Example usage
```

## Testing Strategy

<!-- Describe how this feature has been tested -->

- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed
- [ ] Edge cases considered

## Documentation

- [ ] README updated
- [ ] Code comments added for complex logic
- [ ] API documentation updated
- [ ] Examples provided

## Checklist

- [ ] Feature is complete and functional
- [ ] All tests pass
- [ ] Code follows project style guidelines
- [ ] No breaking changes (unless intended)
- [ ] Performance impact assessed
- [ ] Accessibility considered

## Demo / Screenshots

<!-- Show the feature in action -->

## Migration Guide (if breaking change)

<!-- If this introduces breaking changes, provide migration steps -->

## Performance Impact

<!-- Any performance considerations? -->

## Future Enhancements

<!-- Suggest potential future work related to this feature -->
```

**Best Practices:**
- Include motivation section for context
- Request documentation updates explicitly
- Ask for demo or screenshots
- Include migration guide if breaking changes
- Suggest future enhancements for product roadmap
- Assess performance implications

---

## 8. `.github/DISCUSSION_TEMPLATE/general.yml`

```yaml
title: ""
labels: []
body:
  - type: markdown
    attributes:
      value: |
        # Welcome to Discussions! 👋
        
        This is a space for the community to ask questions, share ideas, and engage in conversations about the project.
        
        **Please check if your topic has already been discussed before posting.**

  - type: dropdown
    id: category
    attributes:
      label: Topic Category
      description: What is this discussion primarily about?
      options:
        - "General Questions"
        - "Show and Tell"
        - "Ideas and Suggestions"
        - "Troubleshooting"
        - "Announcements"
        - "Other"
    validations:
      required: true

  - type: textarea
    id: topic
    attributes:
      label: Discussion Topic
      description: What would you like to discuss?
      placeholder: "Start typing your question or idea here..."
    validations:
      required: true

  - type: textarea
    id: context
    attributes:
      label: Additional Context
      description: Any background or context that might be helpful?
      placeholder: "Version, environment, or relevant details..."

  - type: checkboxes
    id: search
    attributes:
      label: Before Posting
      options:
        - label: I searched for existing discussions on this topic
          required: true
        - label: I have read the documentation and README
          required: false
```

**Best Practices:**
- Include welcome message with community guidelines
- Use dropdown to categorize discussions
- Require search verification before posting
- Keep fields minimal for discussions (simpler than issues)
- Allow optional context field for flexibility

---

## 9. `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Check code formatting
        run: npm run format:check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  build:
    name: Build
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Check build size
        run: npm run build:analyze

  security:
    name: Security Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
        continue-on-error: true

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npm run type-check
```

**Best Practices:**
- Use concurrency to cancel outdated runs
- Separate concerns into different jobs
- Use caching for faster builds
- Include linting, testing, type checking, and security
- Upload coverage reports
- Add build size analysis
- Use conditions for optional jobs

---

## 10. `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

permissions:
  contents: read
  deployments: write

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel (Staging)
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
        run: npm run deploy:staging

      - name: Create deployment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.ref,
              environment: 'staging',
              required_contexts: [],
              auto_merge: false,
              description: 'Staging deployment'
            })

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel (Production)
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
        run: npm run deploy:production

      - name: Create deployment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.ref,
              environment: 'production',
              required_contexts: [],
              auto_merge: false,
              description: 'Production deployment'
            })

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "Deployment to production ${{ job.status }}: ${{ github.server_url }}/${{ github.repository }}/commit/${{ github.sha }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Best Practices:**
- Use environments for staging and production
- Add workflow dispatch for manual triggers
- Require passing tests before deployment
- Use appropriate permissions (least privilege)
- Separate staging and production deployments
- Add status notifications
- Include deployment tracking

---

## 11. `.github/instructions/coding-standards.instructions.md`

```markdown
---
applyTo: "src/**/*.{ts,tsx,js,jsx}"
---

# Coding Standards & Guidelines

## Overview

This document outlines the coding standards and best practices for this project. Use these guidelines to write consistent, maintainable, and high-quality code.

## TypeScript/JavaScript

### Type Safety
- **Always use TypeScript** - use strict mode in `tsconfig.json`
- **Type all function parameters and return types**
- **Avoid `any` type** - use `unknown` if necessary and narrow properly
- **Use `const` by default** - only use `let` for mutable values, never use `var`
- **Use interfaces for object shapes** - prefer interfaces over type aliases for object contracts

```typescript
// ✅ Good
function processUser(user: User): Promise<Result> {
  return api.process(user);
}

// ❌ Avoid
function processUser(user: any) {
  return api.process(user);
}
```

### Code Organization
- Keep files focused on a single responsibility
- Export main functionality as default export
- Group related functions together
- Use barrel exports (index.ts) for clean imports

```typescript
// src/utils/index.ts
export { validateEmail } from './validators/email';
export { formatDate } from './formatters/date';
```

### Error Handling
- Always handle promise rejections with try-catch or .catch()
- Create custom error classes for different error types
- Provide context in error messages
- Log errors with sufficient information for debugging

```typescript
// ✅ Good
try {
  const data = await fetchUser(id);
} catch (error) {
  logger.error('Failed to fetch user', { userId: id, error });
  throw new UserFetchError(`Cannot fetch user ${id}`, { cause: error });
}
```

## React Best Practices

### Component Structure
- **Use functional components exclusively** - no class components
- **Use hooks for state management** - useState, useEffect, useContext
- **Memoize expensive computations** - useMemo for derived state
- **Prevent unnecessary re-renders** - React.memo for pure components, useCallback for handlers

```typescript
// ✅ Good
const UserProfile: React.FC<Props> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const displayName = useMemo(() => 
    user ? `${user.firstName} ${user.lastName}` : 'Anonymous'
  , [user]);

  return <div>{displayName}</div>;
};

export default React.memo(UserProfile);
```

### Naming Conventions
- **Component files**: PascalCase (e.g., `UserProfile.tsx`)
- **Utility files**: camelCase (e.g., `userService.ts`)
- **Hook files**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Props Pattern
- Use TypeScript interfaces for all props
- Keep props focused and minimal
- Use destructuring in component parameters
- Provide default values where appropriate

```typescript
interface UserProfileProps {
  userId: string;
  showEmail?: boolean;
  onUpdate?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  showEmail = false,
  onUpdate 
}) => {
  // Implementation
};
```

## Performance Best Practices

### Bundle Optimization
- Use code splitting for large routes
- Lazy load components: `const Comp = lazy(() => import('./Component'))`
- Tree-shake unused code with proper exports
- Monitor bundle size in CI/CD pipeline

### Runtime Performance
- Avoid creating functions in render
- Memoize callbacks with `useCallback`
- Lazy load images with `loading="lazy"`
- Use virtualization for long lists

### Data Management
- Cache API responses appropriately
- Use pagination for large datasets
- Minimize re-renders with Context splitting
- Debounce search/filter inputs

## Testing Requirements

### Unit Tests
- Minimum **80% code coverage** for critical paths
- Test component behavior, not implementation
- Use React Testing Library for component tests
- Use Jest for unit tests

```typescript
// ✅ Good test
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        username: 'testuser'
      });
    });
  });
});
```

### Integration Tests
- Test user workflows end-to-end
- Mock external APIs appropriately
- Test error scenarios

## Styling

### CSS Approach
- Use **CSS Modules** for component styles
- Use **Tailwind CSS** for utility-first styling (if applicable)
- Avoid inline styles
- Use BEM naming: `.block__element--modifier`

```css
/* ✅ Good */
.card {
  padding: 1rem;
}

.card__header {
  font-weight: bold;
}

.card__header--highlighted {
  color: blue;
}
```

## Commit Messages

### Format
Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `test`, `refactor`, `perf`, `chore`

**Example:**
```
feat(auth): add OAuth2 provider support

- Add Google OAuth provider
- Add Microsoft OAuth provider
- Update configuration schema

Closes #123
```

## Accessibility (a11y)

- Use semantic HTML elements
- Include `alt` text for images
- Ensure keyboard navigation works
- Test with screen readers
- Maintain minimum contrast ratio of 4.5:1

## Security

- Sanitize user input to prevent XSS
- Validate data on both client and server
- Use HTTPS for all external requests
- Rotate secrets regularly
- Keep dependencies updated
- Never commit secrets or API keys

## Documentation

- Add JSDoc comments for public functions
- Document complex algorithms
- Keep README up-to-date
- Document API changes in PRs
- Add examples for complex features

```typescript
/**
 * Formats a date to a user-friendly string
 * @param date - The date to format
 * @param locale - The locale code (default: 'en-US')
 * @returns Formatted date string
 * @example
 * formatDate(new Date('2024-01-15'), 'pt-BR') // '15/01/2024'
 */
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale).format(date);
}
```

## Linting & Formatting

- Run **ESLint** before committing
- Use **Prettier** for code formatting
- Configure editor to format on save
- Use pre-commit hooks (husky) to enforce standards

## Review Process

- All code must be reviewed before merging
- CI/CD checks must pass (lint, test, build)
- Maintain test coverage above 80%
- Address all comments or provide justification
- Squash commits before merging
```

**Best Practices:**
- Use code examples throughout
- Include both good and bad patterns
- Cover language-specific best practices
- Address performance, security, and accessibility
- Document team conventions
- Use syntax highlighting for code blocks
- Include JSDoc examples for common functions

---

## 12. `.github/CONTRIBUTING.md`

```markdown
# Contributing Guidelines

Thank you for considering contributing to this project! 🎉

We appreciate all contributions, whether they're:
- Bug reports
- Feature requests
- Code submissions
- Documentation improvements
- Design feedback
- Testing and quality assurance

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Testing](#testing)
- [Documentation](#documentation)
- [Questions](#questions)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [maintainers@example.com].

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/YOUR_REPO.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Running the Project

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Making Changes

### Branch Naming

Use descriptive branch names:

```
feat/add-user-authentication    # Feature
fix/resolve-login-bug           # Bug fix
docs/update-readme              # Documentation
test/add-payment-tests          # Tests
refactor/simplify-auth-service  # Refactor
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Examples:**
```
feat(auth): implement JWT token refresh mechanism

- Add refresh token rotation
- Extend token expiry to 24 hours
- Add cleanup for expired tokens

Closes #456
```

```
fix(ui): correct button alignment in mobile view

The submit button was overlapping with the form.

Fixes #123
```

### Before You Push

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests locally**
   ```bash
   npm test
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Build to verify**
   ```bash
   npm run build
   ```

5. **Check for sensitive data**
   ```bash
   git diff --staged
   # Ensure no secrets, API keys, or passwords
   ```

## Submitting Changes

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feat/your-feature-name
   ```

2. **Create pull request on GitHub**
    - Use the provided PR template
    - Fill in all sections clearly
    - Link related issues
    - Add descriptive screenshots if applicable

3. **PR Title Format**
   ```
   [TYPE] Brief description of the change
   
   Examples:
   [FEAT] Add user authentication
   [FIX] Resolve login bug
   [DOCS] Update API documentation
   ```

### PR Review Process

- **Automated checks must pass**: linting, testing, type checking
- **Minimum 1 approval** from maintainers
- **Address feedback** on code review
- **No force-pushing** after review begins
- **Squash commits** before final merge

### When Your PR is Approved

1. Ensure your branch is up-to-date:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Squash commits if needed:
   ```bash
   git rebase -i upstream/main
   # Mark commits as 'squash' (s) except the first
   ```

3. Maintainers will merge your PR

## Testing

### Requirements

- All code must include tests
- Minimum 80% code coverage
- Tests must pass locally before pushing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/utils.test.ts
```

### Writing Tests

Use the provided test template:

```typescript
describe('Feature Name', () => {
	beforeEach(() => {
		// Setup before each test
	});

	afterEach(() => {
		// Cleanup after each test
	});

	it('should handle the expected case', () => {
		// Arrange
		const input = 'test';

		// Act
		const result = myFunction(input);

		// Assert
		expect(result).toBe('expected');
	});

	it('should handle error cases', () => {
		expect(() => myFunction(null)).toThrow();
	});
});
```

## Documentation

All new features must include documentation:

1. **JSDoc comments** for functions
2. **README updates** if user-facing
3. **API documentation** if adding endpoints
4. **Examples** for complex features
5. **Changelog entry** in CHANGELOG.md

### Documentation Template

```markdown
## Feature Name

Brief description of what this feature does.

### Usage

```typescript
// Code example
```

### Options

- `option1`: Description
- `option2`: Description

### Examples

More detailed examples...
```

## Common Issues

### My PR fails CI checks

1. **Lint errors**: Run `npm run format` to auto-fix
2. **Test failures**: Run `npm test` locally to debug
3. **Type errors**: Run `npm run type-check` to identify issues
4. **Build errors**: Run `npm run build` to see full error

### How do I update my PR?

```bash
# Make changes
git add .
git commit -m "fix: address review feedback"

# Push to update PR
git push origin feat/your-feature-name
```

### How do I sync with main?

```bash
git fetch upstream
git rebase upstream/main
git push origin feat/your-feature-name --force-with-lease
```

## Questions or Need Help?

- **GitHub Discussions**: [Link to discussions]
- **Issue tracker**: [Link to issues]
- **Email**: maintainers@example.com
- **Documentation**: [Link to docs]

## Recognition

Contributors are recognized in:
- README.md
- GitHub contributors page
- Release notes

Thank you for contributing! 🚀
```

**Best Practices:**
- Provide detailed setup instructions
- Include branch naming conventions
- Explain PR review process
- Add troubleshooting section
- Include testing requirements
- Provide examples for commit messages
- Link to resources and team contact

---

## 13. `.github/CODE_OF_CONDUCT.md`

```markdown
# Code of Conduct

## Our Commitment

We are committed to providing a welcoming and inspiring community for all. We expect all participants to adhere to this Code of Conduct in all interactions, both online and offline.

## Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing opinions, viewpoints, and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members
- Respecting privacy and confidentiality

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting
- Discrimination or exclusion based on protected characteristics

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.

## Scope

This Code of Conduct applies to all community spaces, and also applies when an individual is officially representing the community in public spaces. Examples of representing our community include using an official e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement at [EMAIL]. All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the reporter of any incident.

## Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate.

### 2. Warning

**Community Impact**: A violation through a single incident or series of actions.

**Consequence**: A warning with consequences for continued behavior. No interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, for a specified period of time.

### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public communication with the community for a specified period of time.

### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment of an individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the community.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.0, available at [https://www.contributor-covenant.org/version/2/0/code_of_conduct.html](https://www.contributor-covenant.org/version/2/0/code_of_conduct.html).
```

**Best Practices:**
- Clearly define acceptable and unacceptable behavior
- Explain enforcement process
- Provide multiple reporting channels
- Include examples of violations
- Address severity levels (warnings to bans)
- Attribute sources (e.g., Contributor Covenant)

---

## 14. `.github/SECURITY.md`

```markdown
# Security Policy

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a security vulnerability, please report it responsibly by following these guidelines:

### DO NOT

- Do not open a public GitHub issue for the vulnerability
- Do not post on social media or public forums
- Do not share details with unauthorized parties

### DO

1. **Report privately** by sending an email to: `security@example.com`
2. **Include details**:
    - Type of vulnerability (e.g., XSS, SQL injection, etc.)
    - Location in the codebase (file and line number if possible)
    - Description of the vulnerability
    - Potential impact (severity assessment)
    - Proof of concept or steps to reproduce (if applicable)
    - Your recommended fix (if you have one)

3. **Wait for acknowledgment**: We will acknowledge receipt within 48 hours
4. **Work with us**: We'll investigate and provide updates on our progress

## Responsible Disclosure Timeline

- **Day 0**: You report the vulnerability
- **Day 1-2**: We acknowledge and begin investigation
- **Day 3-7**: We develop and test a fix
- **Day 8-14**: We release a security patch
- **Day 15+**: We disclose the vulnerability publicly (with your permission)

## Security Considerations

### Our Commitment

- We regularly update dependencies to patch known vulnerabilities
- We scan code for security issues using automated tools
- We review all security reports seriously and promptly
- We credit security researchers who responsibly report issues

### Supported Versions

| Version | Supported          |
|---------|-------------------|
| 3.x     | ✅ Yes            |
| 2.x     | ⚠️ Limited        |
| 1.x     | ❌ No             |

### Dependency Updates

We follow these practices:

- **Critical vulnerabilities**: Patched within 48 hours
- **High vulnerabilities**: Patched within 1 week
- **Medium vulnerabilities**: Patched within 2 weeks
- **Low vulnerabilities**: Patched with next release

## Security Best Practices for Users

When using this project:

1. **Keep updated**: Always use the latest version
2. **Review dependencies**: Check the dependency list for known issues
3. **Configure securely**: Follow configuration best practices
4. **Report issues**: Report discovered vulnerabilities responsibly
5. **Use HTTPS**: Always use HTTPS in production

## Security Scanning

We use the following tools to maintain security:

- **Snyk**: Dependency vulnerability scanning
- **ESLint security plugins**: Code vulnerability detection
- **Dependabot**: Automated dependency updates
- **OWASP**: Security best practices

## Security Headers

All production deployments include:

- `Content-Security-Policy`: Prevents XSS attacks
- `X-Frame-Options: DENY`: Prevents clickjacking
- `X-Content-Type-Options: nosniff`: Prevents MIME sniffing
- `Strict-Transport-Security`: Enforces HTTPS

## Authentication & Authorization

- All API endpoints require authentication
- Use JWT tokens for stateless authentication
- Tokens expire after 24 hours
- Refresh tokens rotate on each use
- Passwords meet complexity requirements
- Multi-factor authentication is supported

## Data Protection

- All sensitive data is encrypted at rest
- All data in transit uses TLS 1.3
- Personal data is handled per privacy policy
- Regular security audits are performed
- Compliance with GDPR and similar regulations

## Questions?

For security-related questions (not vulnerability reports):
- Email: security@example.com
- Documentation: [Link to security docs]

---

**Last Updated**: January 2024
```

**Best Practices:**
- Clearly state "do not" and "do" for reporting
- Include responsible disclosure timeline
- Define supported versions
- Explain security tools and practices
- Detail security measures in place
- Include security headers information

---

## 15. `CONTRIBUTING.md` (Root Level - Alternative)

```markdown
# Contributing to [Project Name]

Welcome! We're excited that you want to contribute. This document provides guidelines and instructions for contributing to this project.

## Quick Links

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Security Policy](./.github/SECURITY.md)
- [Issue Templates](./.github/ISSUE_TEMPLATE/)
- [Full Contributing Guide](./.github/CONTRIBUTING.md)

## Contribution Options

### Report a Bug 🐛

Found a bug? Please [open an issue](../../issues/new?template=01-bug_report.yml) with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, browser, etc.)

### Suggest a Feature ✨

Have an idea? [Submit a feature request](../../issues/new?template=02-feature_request.md) with:
- Use case and value proposition
- Detailed description of the feature
- Possible implementation approach

### Improve Documentation 📚

Help improve our docs by:
1. Finding unclear or missing documentation
2. [Opening an issue](../../issues/new?template=03-documentation.md)
3. Submitting a pull request with improvements

### Submit Code

Ready to code?

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Commit: `git commit -m "feat: add amazing feature"`
7. Push: `git push origin feat/amazing-feature`
8. [Open a pull request](../../compare)

See [full contributing guide](./.github/CONTRIBUTING.md) for details.

## Getting Help

- 📖 Read the [documentation](./docs)
- 💬 Join [discussions](../../discussions)
- 🆘 Check [existing issues](../../issues)
- 📧 Email us at hello@example.com

## Development Setup

```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install

# Start development
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

For detailed setup instructions, see [CONTRIBUTING.md](./.github/CONTRIBUTING.md).

---

Thank you for contributing! 🙏
```

**Best Practices:**
- Use root-level CONTRIBUTING.md as entry point
- Link to detailed guides in `.github/`
- Keep it simple and welcoming
- Provide quick links to issue templates
- Include quick-start instructions

---

## Summary & Usage

To use these templates:

1. **Copy each template** to its corresponding location in your repository
2. **Customize values** (URLs, email addresses, project names)
3. **Adjust requirements** based on your team's needs
4. **Test templates** by creating an issue/PR
5. **Review and iterate** based on contributor feedback

### Quick Start Commands

```bash
# Create directory structure
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github/PULL_REQUEST_TEMPLATE
mkdir -p .github/DISCUSSION_TEMPLATE
mkdir -p .github/workflows
mkdir -p .github/instructions

# Copy templates
# (Copy content from this guide to appropriate files)

# Commit to repository
git add .github/
git commit -m "docs: add GitHub templates and guidelines"
git push origin main
```

### Template Customization Checklist

- [ ] Replace `YOUR_ORG` with your organization name
- [ ] Replace `YOUR_REPO` with your repository name
- [ ] Update email addresses and contact information
- [ ] Adjust Node.js version if needed (currently 20.x)
- [ ] Customize labels based on your workflow
- [ ] Update environment names for deployments
- [ ] Add your Slack webhook if using notifications
- [ ] Review and adjust severity levels and requirements
- [ ] Ensure links point to correct resources
- [ ] Test all templates before going live
