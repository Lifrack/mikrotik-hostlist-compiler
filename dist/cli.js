#!/usr/bin/env node
import * as fs from "node:fs";
import * as path from "node:path";
import compile from "@adguard/hostlist-compiler";
/**
 * Muy simple: leer args tipo:
 *   mikrotik-hostlist-compiler-ts -c config.json -o salida.rsc
 */
function parseArgs(argv) {
    let configPath;
    let outputPath;
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if ((arg === "-c" || arg === "--config") && argv[i + 1]) {
            configPath = argv[i + 1];
            i++;
        }
        else if ((arg === "-o" || arg === "--output") && argv[i + 1]) {
            outputPath = argv[i + 1];
            i++;
        }
    }
    return { configPath, outputPath };
}
/**
 * Transformar una línea genérica a un comando de MikroTik.
 * Soporta:
 *  - Formato hosts:   "0.0.0.0 dominio.com"
 *  - Formato AdGuard: "||dominio.com^"
 */
function transformLineToMikrotik(line, listName = "Ads-list") {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) {
        return null;
    }
    // Caso 1: /etc/hosts style -> 0.0.0.0 dominio.com
    const hostsMatch = trimmed.match(/^0\.0\.0\.0\s+([^\s#]+)/);
    if (hostsMatch) {
        const host = hostsMatch[1];
        return `add address=${host} disabled=no dynamic=no list=${listName}`;
    }
    // Caso 2: reglas AdGuard -> ||dominio.com^
    const adguardMatch = trimmed.match(/^\|\|([^\/\^]+)\^/);
    if (adguardMatch) {
        const host = adguardMatch[1];
        return `add address=${host} disabled=no dynamic=no list=${listName}`;
    }
    // Cualquier otra cosa la ignoramos por ahora
    return null;
}
async function main() {
    const { configPath, outputPath } = parseArgs(process.argv);
    if (!configPath || !outputPath) {
        console.error("Uso:");
        console.error("  mikrotik-hostlist-compiler-ts -c config.json -o mikrotik-ads.rsc");
        process.exit(1);
    }
    const resolvedConfigPath = path.resolve(configPath);
    if (!fs.existsSync(resolvedConfigPath)) {
        console.error(`No se encontró el archivo de configuración: ${resolvedConfigPath}`);
        process.exit(1);
    }
    const rawConfig = fs.readFileSync(resolvedConfigPath, "utf8");
    const config = JSON.parse(rawConfig);
    console.log("Compilando listas con @adguard/hostlist-compiler...");
    const lines = await compile(config);
    console.log(`Recibidas ${lines.length} líneas. Convirtiendo a formato MikroTik...`);
    const listName = config.mikrotikListName || "Ads-list";
    const mikrotikLines = [];
    for (const line of lines) {
        const converted = transformLineToMikrotik(line, listName);
        if (converted) {
            mikrotikLines.push(converted);
        }
    }
    console.log(`Quedaron ${mikrotikLines.length} entradas para MikroTik.`);
    const resolvedOutputPath = path.resolve(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
    fs.writeFileSync(resolvedOutputPath, mikrotikLines.join("\n") + "\n", "utf8");
    console.log(`Archivo generado: ${resolvedOutputPath}`);
    console.log("Ahora puedes importarlo en RouterOS con:");
    console.log(`  /import file-name=${path.basename(resolvedOutputPath)}`);
}
main().catch((err) => {
    console.error("Error al ejecutar el compilador:", err);
    process.exit(1);
});
