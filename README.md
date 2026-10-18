# Inscripciones · Academia Movida SST

Sitio público: https://inscripciones.movidasst.com/

## Propósito
Página de **consulta del catálogo de cursos publicados en Moodle**. Mantiene solo tres pestañas:
- **Cursos**: cursos visibles en la Academia (nombre, categoría, duración y precio cuando Moodle los informa), búsqueda, filtro y enlace a la ficha oficial.
- **Medios de pago**: transferencia Venezuela, Pago Móvil, Binance y PayPal; botón de copia y orientación general.
- **Comunidad**: grupo y canal de WhatsApp, registro, acceso a Moodle y contacto.

No hay valoraciones, reseñas, formularios de opinión, cursos ficticios, Google Sheets complementario ni panel de administración.

## Fuente de datos y reglas
- Origen exclusivo: Supabase Edge Function pública `academia-catalogo-publico`, que consulta Moodle por el servicio `core_course_get_courses_by_field`; los tokens se guardan en el servidor.
- La función del catálogo entrega solo cursos con visibilidad pública dentro de las categorías 14 (Gratuitos), 24 (De Pago), 26 (Actualización Profesional Continua) y 27 (Cursos Corporativos); comprueba también la visibilidad de la categoría.
- El cliente solo acepta registros con `origen=moodle`, identificadores Moodle válidos y esas cuatro categorías; construye el enlace exclusivamente con el ID a `https://movidasst.org/course/view.php?id=...`.
- No existen cursos precargados, inventados ni memoria local como reemplazo. Si no es posible consultar el servicio o la respuesta está marcada como `stale`, la página muestra un mensaje con acceso directo al catálogo oficial de Moodle en lugar de enseñar un listado que no se pueda verificar.
- La fuente de precio es Moodle (`precio_texto`); no se fija manualmente el precio de un curso en la página. Los cambios de precio y de visibilidad en Moodle se reflejan cuando el servicio público actualiza su caché (normalmente hasta cinco minutos).

## Pagos
La web no cobra, matricula, comprueba transferencias ni emite certificados. Los datos de pago son información de consulta; el estudiante debe seguir el procedimiento de su curso en Moodle.

## Publicación y verificación
- Sitio estático de GitHub Pages con `CNAME`.
- El diseño responsivo tiene CSS local en `index.html`. Los archivos antiguos de Tailwind quedan como artefactos sin usar.
- Validación: `npm run test` o `node scripts/verificar-sitio.mjs` (verifica JS, tres pestañas, enlaces y ausencia de reseñas/administración/demo).
- Prueba funcional recomendada en navegador: cargar el catálogo, ocultar/publicar un curso en Moodle, esperar el vencimiento de la caché y confirmar su desaparición/aparición; probar pestañas, búsqueda, filtro, pagos y móvil.

No se han eliminado ni modificado cursos dentro de Moodle. Solo se muestra en Inscripciones la oferta pública que devuelve su integración oficial.
