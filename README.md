![License: BMCL](https://img.shields.io/badge/License-BMCL%20☕-brown)

Ideal para firewalls, address-lists y filtrado DNS en MikroTik.

---
## 🚀 Características

- ✔ Usa el **mismo `config.json`** que HostlistCompiler  
- ✔ Acepta múltiples fuentes (hosts, adblock, listas remotas, archivos locales)  
- ✔ Deduplicación y transformaciones nativas  
- ✔ Salida 100% compatible con MikroTik RouterOS  
- ✔ Escrito en TypeScript  
- ✔ Fácil de extender  
- ✔ CLI rápido y multiplataforma  

---

## 📦 Instalación

Clona el repositorio e instala dependencias:
npm install

Compila
npm run build

Ejecuta despues de compilar
node dist/cli.js -c example-config.json -o mikrotik-ads.rsc

## Dudas

### 1.- El nombre del address-list
    El nombre se  define en el archivo config.json tomara el nombre que definas en name


## Licencia

Este proyecto está bajo la **Buy Me a Coffee Non-Commercial License (BMCL)**.

- Puedes usarlo libremente para fines personales, educativos o no comerciales.
- Si deseas usarlo para fines comerciales, debes invitarme un café ☕.

Invítame un café: https://paypal.me/lifrack0  
Consulta el archivo LICENSE para más detalles.
