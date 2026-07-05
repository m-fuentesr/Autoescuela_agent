#!/usr/bin/env node
/**
 * compact-recovery.js — SessionStart Hook (matcher: "compact")
 *
 * Cuando Claude Code compacta la conversación para liberar contexto,
 * se pierde el "cerebro" del agente consultor (glosario, dolores, context map,
 * invariantes). Este hook los re-inyecta automáticamente tras cada compactación
 * para que el agente no responda con amnesia de dominio.
 *
 * stdout → se agrega directamente al contexto de Claude.
 * Inspirado en el compact-recovery.js del repositorio del producto Autoescuela.
 */

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

// El "Discovery Gate" del agente + la memoria viva del dominio.
const brainFiles = [
  'indices/DOMAIN_GLOSSARY.md',
  'indices/PAIN_LOG.md',
  'indices/CONTEXT_MAP.md',
  'indices/BACKLOG.md',
  'specs/eval/compliance_check.md',
  'reuniones/INDEX.md',
];

let output = '';
output += '══════════════════════════════════════════════════════════════\n';
output += ' CEREBRO DEL AGENTE RE-INYECTADO (post-compactacion)\n';
output += '══════════════════════════════════════════════════════════════\n\n';
output += 'El contexto fue compactado. Se restauro la memoria de dominio del\n';
output += 'agente consultor para que NO respondas con amnesia. Antes de proponer\n';
output += 'o responder, respeta el Discovery Gate con estos contenidos.\n\n';

let injectedCount = 0;

for (const file of brainFiles) {
  const fullPath = path.join(cwd, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8').trim();
    if (content) {
      output += `--- ${file} ---\n`;
      output += content + '\n\n';
      injectedCount++;
    }
  }
}

if (injectedCount === 0) {
  output += '(No se encontraron archivos de cerebro del agente en el proyecto)\n';
} else {
  output += '══════════════════════════════════════════════════════════════\n';
  output += `${injectedCount} archivos de conocimiento restaurados. Reactiva el Radar de\n`;
  output += 'Contexto: sigue capturando lo que el equipo enseñe (Real-Time Sync).\n';
  output += '══════════════════════════════════════════════════════════════\n';
}

process.stdout.write(output);
