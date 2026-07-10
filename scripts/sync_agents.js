const fs = require('fs');
const path = require('path');

const identityPath = path.join(__dirname, '..', '.agent', 'identity.md');
const claudePath = path.join(__dirname, '..', '.claude', 'CLAUDE.md');
const agentsPath = path.join(__dirname, '..', '.agents', 'AGENTS.md');

try {
  let identityContent = '';
  if (fs.existsSync(identityPath)) {
    identityContent = fs.readFileSync(identityPath, 'utf8');
  }

  let claudeContent = '';
  if (fs.existsSync(claudePath)) {
    claudeContent = fs.readFileSync(claudePath, 'utf8');
    
    // Omitimos las primeras líneas introductorias de CLAUDE.md ya que 
    // la identidad se encarga de la cabecera.
    const lines = claudeContent.split('\n');
    let startIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('## 🛡️ DISCOVERY GATE') || lines[i].startsWith('## 🛡️')) {
        startIndex = i;
        break;
      }
    }
    claudeContent = lines.slice(startIndex).join('\n');
  }

  const mergedContent = `${identityContent.trim()}\n\n${claudeContent.trim()}\n`;
  
  // Escribimos a AGENTS.md
  if (!fs.existsSync(path.dirname(agentsPath))) {
    fs.mkdirSync(path.dirname(agentsPath), { recursive: true });
  }
  fs.writeFileSync(agentsPath, mergedContent, 'utf8');
  console.log(`[Sync] AGENTS.md sincronizado correctamente con identity.md y CLAUDE.md`);
} catch (error) {
  console.error('[Sync] Error al sincronizar AGENTS.md:', error.message);
  process.exit(1);
}
