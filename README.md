<p align="center">
  <a href="https://www.twitch.tv/charlyautomatiza"><img alt="Twitch" src="https://img.shields.io/badge/CharlyAutomatiza-Twitch-9146FF.svg" style="max-height: 300px;"></a>
  <a href="https://discord.gg/wwM9GwxmRZ"><img alt="Discord" src="https://img.shields.io/discord/944608800361570315" style="max-height: 300px;"></a>
  <a href="http://twitter.com/char_automatiza"><img src="https://img.shields.io/badge/@char__automatiza-Twitter-1DA1F2.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.youtube.com/channel/UCwEb6xrQtQCEuN_gNgi_Xfg?sub_confirmation=1"><img src="https://img.shields.io/badge/Charly%20Automatiza-Youtube-FF0000.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
  <a href="https://www.linkedin.com/in/gautocarlos/"><img src="https://img.shields.io/badge/Carlos%20 Gauto-LinkedIn-0077B5.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
</p>

<a href="https://www.postman.com/"><img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-320x132.png" /></a><br />

## Starter project creado en vivo en [Stream de Twitch](https://www.twitch.tv/charlyautomatiza) basado en [Postman](https://www.postman.com/), [Newman](https://www.npmjs.com/package/newman), [NodeJS](https://nodejs.org/es/) y [TypeScript](https://www.typescriptlang.org/)

## Tabla de contenidos

### Requerimientos generales

- Instalar [Node.js](https://nodejs.org/es/download/)
- Instalar algún cliente git como por ejemplo [git bash](https://git-scm.com/downloads)
- Instalar [Newman](https://www.npmjs.com/package/newman) de manera global.

    ```bash
    npm install -g newman
    ```

### Instalación del framework de pruebas

#### **Clonar el repositorio:**

```bash
git clone https://github.com/charlyautomatiza/starter-postman-newman.git
```

#### **Instalar las dependencias.**

npm install

#### **Para la ejecución de los test**

```bash
npm run test
```

#### **Los reportes de ejecución quedan en la carpeta newman y se borran ante cada nueva ejecución**

```bash
cd newman
ls
```

#### **Para ejecutar con tus propias collections basta con modificar el require en el archivo [main.ts](./src/main.ts) de la opción "collection"**

```Typescript
// Runner collection local
newman.run({
    collection: require('./collections/yourCollectionName.json'),
    reporters: reporters,
}, function (err: Error | null) {
    if (err) { throw err; }
    console.log('Collection run complete!');
});
```

```Typescript
// Runner collection Cloud
newman.run({
    collection: 'https://www.getpostman.com/collections/YourCollectionID',
    reporters: reporters,
}, function (err: Error | null) {
    if (err) { throw err; }
    console.log('Cloud collection run complete!');
});
```

#### **Para agregar o quitar tipos de reportes basta con modificar la constante reports del archivo [main.ts](./src/main.ts) de la opción "collection"**

```Typescript
// List of reports
const reports = ['junit', 'cli', 'progress', 'json'];
```

#### **Aclaración sobre Cloud Collections**

Para poder ejecutar las collections desde la nube debes tener una cuenta de [Postman](https://www.postman.com/).

Deberás exportar tu collection en la nube y obtener el ID de la collection mediante.

- Seleccionar la opción **"Share"**.
- Seleccionar **"Vía JSON link"**.
