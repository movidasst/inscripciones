# Inscripciones · Academia La Movida de SST

Sitio público: https://inscripciones.movidasst.com/  
Administración de reseñas y estados de matrícula: https://inscripciones.movidasst.com/moderacion.html

## Qué hace

Página pública de los cursos de la Academia publicados en Moodle, con búsqueda, categorías,
ordenamiento, duración, precios informados por Moodle, programas/resúmenes e imágenes cuando
están disponibles. Proporciona enlaces a la ficha oficial y orientación de pago; **no matricula,
cobra, aprueba pagos ni emite certificados por sí misma**.

## Fuente de cursos y sincronización

- El catálogo lee Moodle mediante `core_course_get_courses_by_field` desde la Supabase Edge
  Function `academia-catalogo-publico`. La conexión a Moodle usa exclusivamente secretos del servidor.
- Moodle conserva autoridad sobre identificador, visibilidad, categoría y precio. El precio actual de
  *Gestión SST de Contratistas en Venezuela* (ID Moodle 151) es **15 USD**; 10 USD fue una
  promoción anterior. No codificar precios promocionales directamente en la web.
- Categorías: Actualización Profesional Continua (26), Gratuitos (14), De Pago (24),
  Cursos Corporativos (27). Cursos corporativos pueden dirigirse a `presupuesto.movidasst.com`.
- Precios/horas: desde resumen y/o campos personalizados de Moodle. Los datos complementarios de
  Google Sheets **nunca sobrescriben precios** de Moodle.
- La caché pública dura hasta 5 minutos; ante fallo transitorio puede ofrecer la última copia conocida.
- **Las fechas de apertura del curso en Moodle no son automáticamente fechas de sesiones formativas.**
  El calendario de una edición procede de un campo específico de Moodle o de la tabla
  `academia_curso_calendario`, administrable desde `moderacion.html` con verificación y publicación
  expresas. Para Contratistas (ID 151) se registró 19–22 de octubre de 2026, 20:00–22:00 Venezuela.
- Las imágenes proceden de los archivos descriptivos del curso en Moodle, siempre que sean servibles
  públicamente sin tokens. Si la imagen no es accesible se muestra el diseño estándar.
- Ningún token Moodle o clave privilegiada está presente en HTML público.

## Matrícula: estado confirmado y permisos

La función Moodle `core_enrol_get_course_enrolment_methods` no está autorizada para el token
actual: no se inventa disponibilidad. Por defecto la ficha indica que se deben consultar las
condiciones de matrícula en Moodle. Una función de Gestión permite a un administrador
registrar manualmente `abierta` o `cerrada`, **solo después de verificarlo en Moodle**.
Este estado:
1. Requiere motivo y fecha de expiración (máximo 90 días).
2. Se almacena en tabla RLS protegida y se publica mediante el catálogo solo mientras esté vigente.
3. Vencido el plazo regresa a *Por verificar*; la ficha oficial sigue siendo la fuente final.
4. No realiza operaciones sobre alumnos ni métodos de matrícula.

Para lograr verificación automática real, incorporar `core_enrol_get_course_enrolment_methods`
al servicio/token de lectura de Moodle y validar que los métodos, fechas, restricciones y cupos
sean interpretables para usuarios no matriculados.

## Reseñas y moderación

- Las **reseñas nuevas** se envían a la Edge Function `academia-resenas`, que valida el curso
  publicado, contenido y calificación; limita intentos y guarda el envío con estado `pendiente`.
- El catálogo consulta solo las reseñas `aprobada` en `academia-resenas`. Si falla el servicio,
  **no falsea calificaciones** ni oculta los cursos.
- `moderacion.html` exige autenticación Supabase y rol administrador de Gestión.
- Al aprobar/rechazar una opinión queda registrada la decisión. Marcar
  `matricula_verificada` requiere comprobar la matrícula en Moodle e indicar evidencia en la
  observación; las opiniones sin comprobación no reciben sello de matrícula.
- Los datos históricos de Google Apps Script se mantienen en su fuente original. El
  administrador puede importarlos **como pendientes**, emparejando por título del curso Moodle,
  sin publicar reseñas anteriores sin revisión.
- Las valoraciones se publican junto con el nombre informado y la calificación, según
  consentimiento del formulario. Evitar publicar información de otras personas.

## Pagos y flujo del estudiante

- Los cursos de pago muestran la opción `Cómo pagar` y el importe de la ficha Moodle.
- La página muestra únicamente orientación de pago. El estudiante debe seguir los requisitos
  y la tarea/flujo de aprobación de Moodle para confirmar su matrícula.
- No se debe dar por válida una inscripción porque se copiaron datos bancarios.
- Para PayPal, no recomendar la modalidad personal `Amigos y familiares` como pago de cursos.

## Compilación y validación

- HTML estático servido desde GitHub Pages; el dominio lo define `CNAME`.
- Estilos de Tailwind compilados en `assets/tailwind.css`, no mediante el script CDN en producción.
- `package.json` fija Tailwind `3.4.17`; `package-lock.json` conserva dependencias resueltas.
- `.github/workflows/compilar-estilos.yml` recompila al cambiar el HTML o archivos de estilo.
- `.github/workflows/verificar-sitio.yml` ejecuta `node scripts/verificar-sitio.mjs` para validar
  sintaxis JS, HTML, enlaces, CSS y referencias a integraciones.

## Lista de pruebas

1. Confirmar que `academia-catalogo-publico` responda `HTTP 200` con `source=moodle`,
   categorías, cursos y estado de matrícula.
2. Verificar que el precio de Contratistas ID 151 sea 15 USD.
3. Comprobar los filtros de categoría, ordenamiento, búsqueda y vista móvil.
4. Crear una reseña de prueba, verificar estado `pendiente`, luego eliminar el dato de prueba.
5. Comprobar que un usuario sin permiso de Gestión no pueda moderar.
6. Importar reseñas históricas solo mediante cuenta administrativa, comprobando coincidencias.
7. Confirmar a mano los métodos de inscripción de Moodle antes de declarar un curso abierto.
8. Verificar que `assets/tailwind.css` esté disponible desde GitHub Pages tras desplegar.

## Estado comprobado tras el despliegue de octubre de 2026

- La Edge Function del catálogo respondió HTTP 200 y devolvió 24 cursos.
- El curso 151 devolvió 15 USD, calendario 19–22 de octubre e imagen de Moodle.
- La función de reseñas aceptó una reseña sintética con estado pendiente; el dato temporal fue borrado.
- La disponibilidad de matrícula permanece **por verificar** hasta confirmar restricciones reales en Moodle o registrar una comprobación administrativa con caducidad.
- La inspección automática revisa la estructura de HTML, enlaces externos, JavaScript y CSS compilado; no reemplaza una prueba visual completa en navegador.
