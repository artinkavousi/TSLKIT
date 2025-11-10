# Contributing to TSLStudio

Thank you for your interest in contributing to TSLStudio! 🎉

---

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/tslstudio.git
   cd tslstudio
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes**
6. **Test your changes**
   ```bash
   npm test
   npm run build
   ```
7. **Commit and push**
   ```bash
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**

---

## 🎨 Contributing Materials

### Adding a New Material

1. **Create the material file**
   ```typescript
   // src/materials/myMaterial.ts
   import { Color } from 'three'
   import { Fn, vec3, positionGeometry } from 'three/tsl'
   import { TSLFn, prepare } from './utils.js'

   interface MyMaterialOptions {
     scale?: number
     color?: Color
     seed?: number
   }

   const defaults: Required<MyMaterialOptions> = {
     $name: 'My Material',
     scale: 2,
     color: new Color(0xFFFFFF),
     seed: 0,
   }

   export const myMaterial = TSLFn(([params]: any) => {
     params = prepare([params], defaults)
     
     const pos = positionGeometry.mul(params.scale)
     // ... your TSL code here
     
     return vec3(1, 0, 0) // return color
   }, defaults)
   ```

2. **Add JSDoc documentation**
   ```typescript
   /**
    * My Material
    * 
    * Description of what this material does
    * 
    * @param params - Material parameters
    * @param params.scale - Pattern scale (default: 2)
    * @param params.color - Material color
    * @param params.seed - Random seed
    * @returns Color node
    * 
    * @example
    * ```typescript
    * import { myMaterial } from '@tslstudio/materials'
    * 
    * material.colorNode = myMaterial({
    *   scale: 2,
    *   color: new Color(0xFF0000)
    * })
    * ```
    */
   ```

3. **Export from index**
   ```typescript
   // src/materials/index.ts
   export * from './myMaterial.js'
   ```

4. **Add tests**
   ```typescript
   // tests/materials/materials.test.ts
   it('myMaterial - should be callable', () => {
     expect(Materials.myMaterial).toBeDefined()
     expect(typeof Materials.myMaterial).toBe('function')
   })
   ```

5. **Update documentation**
   - Add to `MATERIALS_GUIDE.md`
   - Update material count in `README.md`

### Material Guidelines

✅ **DO:**
- Use the `TSLFn` wrapper for materials
- Use `prepare` for parameter processing
- Add complete JSDoc documentation
- Include usage examples
- Test your material
- Use TypeScript
- Follow existing patterns
- Keep materials focused and modular

❌ **DON'T:**
- Use `any` types unnecessarily
- Create materials without documentation
- Break existing patterns
- Add large dependencies
- Skip testing

---

## 📝 Code Style

### TypeScript

```typescript
// Good
export const marble = TSLFn(([params]: any) => {
  params = prepare([params], defaults)
  const pos = positionGeometry.mul(params.scale)
  return noise(pos)
}, defaults)

// Bad
export const marble = (params) => {
  let pos = positionGeometry.mul(params.scale || 2)
  return noise(pos)
}
```

### JSDoc

```typescript
/**
 * Material Name
 * 
 * Brief description
 * 
 * @param params - Material parameters
 * @param params.scale - Parameter description
 * @returns Description of return value
 * 
 * @example
 * ```typescript
 * // Usage example
 * ```
 */
```

### Naming Conventions

- **Materials**: camelCase (e.g., `marble`, `tigerFur`, `neonLights`)
- **Interfaces**: PascalCase with suffix (e.g., `MarbleOptions`)
- **Constants**: camelCase for defaults
- **Functions**: camelCase

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import { myMaterial } from '../../src/materials/myMaterial.js'

describe('My Material', () => {
  it('should be callable', () => {
    expect(myMaterial).toBeDefined()
    expect(typeof myMaterial).toBe('function')
  })

  it('should have defaults', () => {
    expect((myMaterial as any).defaults).toBeDefined()
  })
})
```

---

## 📚 Documentation

### Material Documentation

Each material should have:

1. **JSDoc comments** in the source file
2. **Entry in MATERIALS_GUIDE.md** with:
   - Description
   - Usage example
   - Parameter details
   - Special features
3. **Update README.md** material count

### Writing Good Documentation

✅ **DO:**
- Be clear and concise
- Include working code examples
- Explain parameters
- Show real use cases
- Keep examples simple

❌ **DON'T:**
- Assume prior knowledge
- Use jargon without explanation
- Provide incomplete examples
- Leave parameters undocumented

---

## 🐛 Bug Reports

### Before Reporting

1. Search existing issues
2. Check if it's already fixed in main
3. Try to reproduce with minimal example
4. Test with latest Three.js version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Install package
2. Create material...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Three.js: [e.g., r181]
- TSLStudio: [e.g., 0.2.0]

**Code Example**
```typescript
// Minimal reproduction
```

**Screenshots**
If applicable
```

---

## 💡 Feature Requests

### Before Requesting

1. Check if it already exists
2. Search existing issues
3. Consider if it fits the project scope

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this needed?

**Proposed Solution**
How could this work?

**Alternatives**
Other approaches considered

**Additional Context**
Any other information
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Title Format

```
type(scope): description

Examples:
feat(materials): add lava material
fix(marble): correct color interpolation
docs(readme): update installation steps
test(materials): add tests for wood material
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `chore` - Maintenance

### PR Description Template

```markdown
## Description
What does this PR do?

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How was this tested?

## Screenshots
If applicable

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

---

## 📦 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release commit
4. Tag release
5. Push to GitHub
6. Publish to npm

---

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing private information
- Other unethical conduct

---

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/your-org/tslstudio/discussions)
- 🐛 [Issue Tracker](https://github.com/your-org/tslstudio/issues)
- 📖 [Documentation](./MATERIALS_GUIDE.md)

---

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Mentioned in announcements

---

Thank you for contributing to TSLStudio! 🎨✨

Every contribution, no matter how small, is valued and appreciated!

