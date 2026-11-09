# Ticket a ticket — copia para GitHub

- Versión: v61, la misma que está en vivo en Cloudflare.
- Dirección principal (Cloudflare, no se borra): https://ticket-a-ticket.pages.dev/
- Espejo GitHub (cuando se publique): https://elatajoia.github.io/ticket-a-ticket/
- Repositorio: elatajoia/ticket-a-ticket. Publicar desde la rama principal, carpeta raíz, con .nojekyll.
- Ajuste solo del espejo: el manifest (archivo e incrustado en index.html) usa "./" en vez de "../" para que la app instalada abra dentro de la subruta github.io. En la versión en vivo de Cloudflare sigue "../" y funciona igual; en la próxima versión conviene poner "./" en las dos para que sean idénticas.
- Pendiente de comprobar al probar el espejo: la frase "La conexión solo funciona desde https://ticket-a-ticket.pages.dev" — cuando se añada el origen de GitHub en Google Cloud, esa frase habrá que ampliarla en la versión siguiente, en las dos copias.
- No hay claves ni secretos en este repositorio. La clave de Gemini de cada usuario vive solo en su navegador.
- Regla: cada versión nueva se publica el mismo día en Cloudflare y en GitHub, con la misma versión de caché.
