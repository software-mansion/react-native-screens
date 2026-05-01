/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require top-level React component declarations to be exported',
    },
    schema: [],
    messages: {
      requireExport: 'Top-level component "{{name}}" must be exported.',
    },
  },
  create(context) {
    return {
      Program(node) {
        const exportedNames = collectExportedNames(node);

        for (const stmt of node.body) {
          const name = getComponentName(stmt);
          if (name === null) {
            continue;
          }

          if (!exportedNames.has(name)) {
            context.report({
              node: stmt,
              messageId: 'requireExport',
              data: { name },
            });
          }
        }
      },
    };
  },
};

function isPascalCase(name) {
  return /^[A-Z]/.test(name);
}

function getComponentName(stmt) {
  if (
    stmt.type === 'FunctionDeclaration' &&
    stmt.id?.name &&
    isPascalCase(stmt.id.name)
  ) {
    return stmt.id.name;
  }

  if (stmt.type === 'VariableDeclaration' && stmt.declarations.length === 1) {
    const decl = stmt.declarations[0];
    const name = decl.id?.name;
    if (
      name &&
      isPascalCase(name) &&
      decl.init &&
      (decl.init.type === 'ArrowFunctionExpression' ||
        decl.init.type === 'FunctionExpression')
    ) {
      return name;
    }
  }

  return null;
}

function collectExportedNames(program) {
  const names = new Set();

  for (const stmt of program.body) {
    if (stmt.type === 'ExportNamedDeclaration') {
      if (stmt.declaration) {
        for (const name of getDeclaredNames(stmt.declaration)) {
          names.add(name);
        }
      }
      for (const specifier of stmt.specifiers) {
        names.add(specifier.local.name);
      }
    }

    if (stmt.type === 'ExportDefaultDeclaration') {
      const decl = stmt.declaration;
      if (decl.type === 'Identifier') {
        names.add(decl.name);
      } else if (decl.id) {
        names.add(decl.id.name);
      }
    }
  }

  return names;
}

function getDeclaredNames(stmt) {
  if (stmt.type === 'VariableDeclaration') {
    return stmt.declarations.map(d => d.id?.name).filter(Boolean);
  }
  return stmt.id?.name ? [stmt.id.name] : [];
}
