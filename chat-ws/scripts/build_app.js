import fs from 'fs';
var dir = './src/infrastructure/pages/client';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
}

fs.cpSync(
  "../chat-ui/build/client/",
   "./src/infrastructure/pages/client/", { recursive: true })
