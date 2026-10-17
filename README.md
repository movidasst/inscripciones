# Inscripciones · Academia La Movida de SST

Sitio público: https://inscripciones.movidasst.com/

## Propósito

Catálogo público de cursos publicados en **Moodle (Academia Movida SST)**, con acceso a sus fichas oficiales, búsqueda, clasificación, reseñas comunitarias y orientación sobre inscripción y pagos. Este sitio **no matricula por sí solo**, no valida pagos y no emite certificados: estas acciones deben gestionarse a través de la Academia y sus procesos autorizados.

## Arquitectura actual

- GitHub Pages sirve `index.html`; el dominio se configura mediante `CNAME`.
- Catálogo académico: Supabase Edge Function `academia-catalogo-publico` (GET, lectura pública). Consulta Moodle mediante `core_course_get_courses_by_field` desde el servidor. **Ningún token de Moodle debe incorporarse al HTML**.
- Fuente autoritativa de existencia, visibilidad, identificador y enlaces de cursos: Moodle, actualmente `https://movidasst.org`.
- Categorías públicas de Moodle: 26 (Actualización Profesional Continua), 14 (Gratuitos), 24 (De Pago), 27 (Cursos Corporativos). Las categorías nuevas se incorporan deliberadamente tras comprobar sus permisos y visibilidad.
- Precio y duración: campos personalizados de Moodle y, si falta alguno, metadatos complementarios del servicio heredado. Verificar las discrepancias antes de publicar promociones.
- Valoraciones: Google Apps Script (servicio anterior), consultado aparte. Una caída de reseñas no debe ocultar el catálogo. **Las reseñas actuales son opiniones de la comunidad, no necesariamente verificadas como matrículas.**
- Cursos corporativos: acceso a la ficha Moodle y botón para solicitar capacitación en `https://presupuesto.movidasst.com/`.

## Cómo publicar un curso

1. Crear o actualizar el curso en Moodle, dentro de una categoría pública admitida.
2. Confirmar que la visibilidad sea pública, con título y ficha académica correctos.
3. Completar los campos personalizados de **duración** y **precio**; revisar que concuerden con las ofertas promocionales.
4. Verificar `https://inscripciones.movidasst.com/` y su filtro de categoría. El catálogo utiliza una caché de hasta cinco minutos.
5. Probar el botón **Ver curso en Academia** con una sesión de usuario no autenticado y una autenticada. La visualización de la ficha **no garantiza matrícula**.

## Seguridad y mantenimiento

- No publicar tokens Moodle, credenciales Supabase privilegiadas ni secretos de Apps Script.
- La Edge Function solo devuelve información de cursos, no datos personales de alumnos, matrículas ni certificados.
- El formulario de reseñas requiere mantenimiento y moderación del servicio externo.
- La página usa Tailwind por CDN y un archivo HTML monolítico. Como mejora posterior, migrar a CSS compilado, componentes separados y pruebas automatizadas.
- Antes de cambiar métodos de pago, precios o permisos en Moodle, validar el flujo comercial con la administración de la Academia.

## Prueba rápida

- Comprobar que el servicio devuelva `ok: true`, `source: "moodle"` y una lista de cursos.
- Validar búsqueda, filtro de categoría, orden y enlaces desde móvil y escritorio.
- Si Moodle no responde, la página informa del fallo y permite acceder directamente a la Academia.
